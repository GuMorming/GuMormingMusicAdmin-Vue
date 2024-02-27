<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="歌曲名">
        <el-input @keyup.enter="handleQuery" v-model="queryParams.name" style="width: 200px"
                  placeholder="请输入歌曲名"
                  clearable/>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="queryParams.categoryId" placeholder="请选择歌单分类" clearable style="width: 200px">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb15">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openModel(undefined)">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain
                   :disabled="songIdList.length === 0"
                   icon="Delete"
                   @click="handleDelete(undefined)">批量删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表格展示 -->
    <el-table border :data="songList" @selection-change="handleSelectionChange" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 图片 -->
      <el-table-column label="歌曲图片" prop="pic" align="center" width="100">
        <template #default="scope">
          <img :src="scope.row.pic" width="40" height="40"/>
        </template>
      </el-table-column>
      <!-- 歌名 -->
      <el-table-column label="歌名" prop="name" align="center" width="100"></el-table-column>
      <el-table-column label="专辑" prop="album" width="100"></el-table-column>
      <el-table-column label="歌词" align="center">
        <template #default="scope">
          <ul style="height: 100px; overflow: scroll">
            <li v-for="(item, index) in parseLyric(scope.row.lyric)" :key="index">
              {{ item }}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="资源更新" width="120" align="center">
        <template #default="scope">
          <el-upload action
                     :http-request="handleSongUpload"
                     :show-file-list="false"
                     :on-success="handleSongSuccess"
                     :before-upload="beforeSongUpload">
            <el-button type="primary">更新歌曲</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="130">
        <template #default="scope">
          <el-button type="primary" icon="Edit" link @click="openModel(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" icon="Delete" link @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-if="count > 0" :total="count" v-model:page="queryParams.current" v-model:limit="queryParams.size"
                @pagination="getList"/>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="addOrUpdate" width="500px" append-to-body>
      <el-form ref="songFormRef" label-width="100px" :model="songForm" :rules="rules">
        <!-- 歌曲图片 -->
        <el-form-item label="歌曲图片" prop="pic">
          <el-upload drag :show-file-list="false"
                     action
                     :http-request="handleUpload"
                     accept="image/*"
                     :before-upload="beforeUpload"
                     :on-success="handleSuccess">
            <el-icon class="el-icon--upload" v-if="songForm.pic === ''">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text" v-if="songForm.pic === ''">
              将图片拖到此处，或<em>点击上传</em>
            </div>
            <img v-else :src="songForm.pic" width="150"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="歌名" prop="name">
          <el-input placeholder="请输入歌名" v-model="songForm.name" style="width: 250px;"/>
        </el-form-item>
        <el-form-item label="专辑" prop="album">
          <el-input type="text" v-model="songForm.album"></el-input>
        </el-form-item>
        <el-form-item label="歌词" prop="lyric">
          <el-input type="textarea"
                    v-model="songForm.lyric"
                    :autosize="{minRows: 4}"
                    placeholder="lyric文件格式"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click=" addOrUpdate= false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup lang="ts">

import {parseLyric} from "@/utils/lyric";
import {UploadFilled} from "@element-plus/icons-vue";
import {onMounted, reactive, ref, toRefs} from "vue";
import {FormInstance, FormRules, UploadRawFile, UploadRequestOptions} from "element-plus";
import {AxiosResponse} from "axios";
import * as imageConversion from "image-conversion";
import {uploadSong, uploadSongPic} from "@/api/upload";
import {messageConfirm, notifySuccess, notifyWarning} from "@/utils/modal";
import {CategoryItem} from "@/api/category/types";
import {getAllCategory} from "@/api/category";
import {Song, SongBackResponse, SongForm, SongQuery} from "@/api/song/types";
import {addSong, deleteSong, getSongList, updateSong} from "@/api/song";


const songFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{required: true, message: "请输入歌曲名", trigger: "blur"}],
});

const data = reactive({
  count: 0,
  title: "",
  loading: false,
  addOrUpdate: false,
  showSearch: true,
  queryParams: {
    current: 1,
    size: 10,
  } as SongQuery,

  songIdList: [] as number[],
  songList: [] as SongBackResponse[],
  songForm: {} as SongForm,
  categoryList: {} as CategoryItem[],

});
let {
  count,
  title,
  addOrUpdate,
  loading,
  showSearch,
  queryParams,
  songIdList,
  songList,
  songForm,
  categoryList
} = toRefs(data);

const handleSelectionChange = (selection: Song[]) => {
  songIdList.value = selection.map((item) => item.id);
};

const handleSuccess = (response: AxiosResponse) => {
  songForm.value.pic = response.data.data;
};
const handleSongSuccess = (response: AxiosResponse) => {
  songForm.value.url = response.data.data;
}
const beforeUpload = (rawFile: UploadRawFile) => {
  return new Promise(resolve => {
    if (rawFile.size / 1024 < 200) {
      resolve(rawFile);
    }
    // 压缩到200KB,这里的200就是要压缩的大小,可自定义
    imageConversion.compressAccurately(rawFile, 200)
        .then(res => {
          resolve(res);
        });
  });
};
const beforeSongUpload = (rawFile: UploadRawFile) => {
  const ltCode = 10;
  const isLt10M = rawFile.size / 1024 / 1024 < ltCode;
  const testmsg = rawFile.name.substring(rawFile.name.lastIndexOf(".") + 1);
  const extension = testmsg === "mp3";

  if (!extension) {
    notifyWarning("上传文件只能是mp3格式！");
  }
  if (!isLt10M) {
    notifyWarning(`上传头像图片大小不能超过 ${ltCode}MB!`);
  }

  return extension && isLt10M;
}
const handleSongUpload = (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  uploadSong(formData).then(({data}) => {
    if (data.flag) {
      notifySuccess(data.msg);
    }
  })
}
const handleUpload = (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  uploadSongPic(formData).then(({data}) => {
    if (data.flag) {
      notifySuccess(data.msg);
      getList();
    }
  })
};
const openModel = (song?: Song) => {
      if (song !== undefined) {
        title.value = "修改歌曲";
        songForm.value.id = song.id;
        songForm.value.singerId = song.singerId;
        songForm.value.name = song.name;
        songForm.value.categoryId = song.categoryId;
        songForm.value.album = song.album;
        songForm.value.pic = song.pic;
        songForm.value.lyric = song.lyric
      } else {
        title.value = "添加歌曲";
        songForm.value = {
          id: undefined,
          singerId: undefined,
          name: "",
          album: "",
          categoryId: undefined,
          lyric: "",
          pic: "",
          url: ""
        };
      }
      songFormRef.value?.clearValidate();
      addOrUpdate.value = true;
    }
;
const handleDelete = (id?: number) => {
      let ids: number[] = [];
      if (id === undefined) {
        ids = songIdList.value;
      } else {
        ids = [id];
      }
      messageConfirm("确认删除已选中的数据项?").then(() => {
        deleteSong(ids).then(({data}) => {
          if (data.flag) {
            notifySuccess(data.msg);
            getList();
          }
        });
      }).catch(() => {
      });
    }
;
const submitForm = () => {
  songFormRef.value?.validate((valid) => {
    if (valid) {
      if (songForm.value.id !== undefined) {
        updateSong(songForm.value).then(({data}) => {
          if (data.flag) {
            notifySuccess(data.msg);
            getList();
          }
          addOrUpdate.value = false;
        })
      } else {

        addSong(songForm.value).then(({data}) => {
          if (data.flag) {
            notifySuccess(data.msg);
            getList();
          }
          addOrUpdate.value = false;
        })
      }
    }
  })
};

const getList = () => {
  loading.value = true;
  getSongList(queryParams.value).then(({data}) => {
    songList.value = data.data.recordList;
    count.value = data.data.count;
    loading.value = false;
  })
};
const getCategoryList = () => {
  getAllCategory().then(({data}) => {
    categoryList.value = data.data;
  })
}
const handleQuery = () => {
  queryParams.value.current = 1;
  getList();
};

onMounted(() => {
  getList();
  getCategoryList();
});
</script>


<style scoped>

</style>