<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="歌单名关键词">
        <el-input @keyup.enter="handleQuery" v-model="queryParams.keyword" style="width: 200px"
                  placeholder="请输入歌单名关键词"
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
                   :disabled="songListIdList.length === 0"
                   icon="Delete"
                   @click="handleDelete(undefined)">批量删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表格展示 -->
    <el-table border :data="songListList" @selection-change="handleSelectionChange" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 歌单图片 -->
      <el-table-column prop="pic" label="歌单图片" align="center">
        <template #default="scope">
          <img :src="scope.row.pic" width="40" height="40"/>
        </template>
      </el-table-column>
      <!-- 标题 -->
      <el-table-column sortable prop="title" label="标题" align="center"></el-table-column>
      <!-- 简介 -->
      <el-table-column prop="introduction" label="简介" align="center">
        <template #default="scope">
          <el-text line-clamp="3">{{ scope.row.introduction }}</el-text>
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column sortable prop="createTime" label="创建时间" align="center">
        <template #default="scope">
          <div class="create-time">
            <el-icon>
              <clock/>
            </el-icon>
            <span style="margin-left: 10px">{{ formatDate(scope.row.createTime) }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 更新时间 -->
      <el-table-column prop="updateTime" label="更新时间" align="center">
        <template #default="scope">
          <div class="create-time">
            <el-icon>
              <clock/>
            </el-icon>
            <span style="margin-left: 10px">{{ formatDate(scope.row.updateTime) }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 分类 -->
      <el-table-column prop="categoryId" label="分类" align="center">
        <template #default="scope">
          <div v-for="item in categoryList">
            <el-tag type="warning" v-if="scope.row.categoryId === item.id"
                    :key="item.id">
              {{ item.categoryName }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <!-- 歌曲管理-->
      <el-table-column label="歌单内容" align="center">
        <template v-slot="scope">
          <el-button @click="handleOpen(scope.row)">歌曲管理</el-button>
        </template>
      </el-table-column>
      <!-- 评论管理-->
      <el-table-column label="歌单评论" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center">
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
    <pagination v-if="count > 0" :total="count" v-model:page="queryParams.current"
                v-model:limit="queryParams.size"
                @pagination="getList"/>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="addOrUpdate" width="500px" append-to-body>
      <el-form ref="songListFormRef" label-width="100px" :model="songListForm" :rules="rules">
        <!-- 歌单图片 -->
        <el-form-item label="歌单图片" prop="pic">
          <el-upload drag :show-file-list="false"
                     action
                     :http-request="handleUpload"
                     accept="image/*"
                     :before-upload="beforeUpload"
                     :on-success="handleSuccess">
            <el-icon class="el-icon--upload" v-if="songListForm.pic === ''">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text" v-if="songListForm.pic === ''">
              将图片拖到此处，或<em>点击上传</em>
            </div>
            <img v-else :src="songListForm.pic" width="360"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input placeholder="请输入标题" v-model="songListForm.title" style="width: 250px;"/>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <template #default="scope">
            <el-select v-model="songListForm.categoryId" placeholder="请选择歌单分类" clearable style="width: 200px">
              <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id"/>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" v-model="songListForm.introduction" :autosize="{ minRows: 4}"></el-input>
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
import {formatDate} from "@/utils/date";
import {Clock, UploadFilled} from "@element-plus/icons-vue";
import {onMounted, reactive, ref, toRefs} from "vue";
import {FormInstance, FormRules, UploadRawFile, UploadRequestOptions} from "element-plus";
import {SongList, SongListBackResponse, SongListForm, SongListQuery} from "@/api/songList/types";
import {AxiosResponse} from "axios";
import * as imageConversion from "image-conversion";
import {uploadSingerPic} from "@/api/upload";
import {messageConfirm, notifySuccess} from "@/utils/modal";
import {addSongList, deleteSongList, getSongListList, updateSongList} from "@/api/songList";
import {CategoryItem} from "@/api/category/types";
import {getAllCategory} from "@/api/category";
import {useRoute} from "vue-router";
import router from "@/router";

const route = useRoute()
const songListFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [{required: true, message: "请输入歌单标题", trigger: "blur"}],
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
  } as SongListQuery,
  songListIdList: [] as number[],
  songListList: [] as SongListBackResponse[],
  songListForm: {} as SongListForm,
  categoryList: {} as CategoryItem[],

});
let {
  count,
  title,
  addOrUpdate,

  loading,
  showSearch,
  queryParams,
  songListIdList,
  songListList,
  songListForm,
  categoryList
} = toRefs(data);

const handleSelectionChange = (selection: SongList[]) => {
  songListIdList.value = selection.map((item) => item.id);
};

const handleSuccess = (response: AxiosResponse) => {
  songListForm.value.pic = response.data.data;
};
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
const handleUpload = (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  uploadSingerPic(formData).then(({data}) => {
    if (data.flag) {
      notifySuccess(data.msg);
      getList();
    }
  })
};
const openModel = (songList?: SongList) => {
      if (songList !== undefined) {
        title.value = "修改歌单";
        songListForm.value.id = songList.id;
        songListForm.value.title = songList.title;
        songListForm.value.categoryId = songList.categoryId;
        songListForm.value.introduction = songList.introduction;
        songListForm.value.pic = songList.pic;
      } else {
        title.value = "添加歌单";
        songListForm.value = {
          id: undefined,
          title: "",
          categoryId: undefined,
          pic: "",
          introduction: ""
        };
      }
      songListFormRef.value?.clearValidate();
      addOrUpdate.value = true;
    }
;
const handleDelete = (id?: number) => {
      let ids: number[] = [];
      if (id === undefined) {
        ids = songListIdList.value;
      } else {
        ids = [id];
      }
      messageConfirm("确认删除已选中的数据项?").then(() => {
        deleteSongList(ids).then(({data}) => {
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
  songListFormRef.value?.validate((valid) => {
    if (valid) {
      if (songListForm.value.id !== undefined) {
        updateSongList(songListForm.value).then(({data}) => {
          if (data.flag) {
            notifySuccess(data.msg);
            getList();
          }
          addOrUpdate.value = false;
        })
      } else {

        addSongList(songListForm.value).then(({data}) => {
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
const handleOpen = (row: SongList) => {
  router.push({
    path: "/client/song",
    query: {
      songListId: `/${row.id}`
    }
  });

};
const getList = () => {
  loading.value = true;
  getSongListList(queryParams.value).then(({data}) => {
    songListList.value = data.data.recordList;
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