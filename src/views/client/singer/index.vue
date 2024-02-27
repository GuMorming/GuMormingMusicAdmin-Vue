<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="歌手姓名">
        <el-input @keyup.enter="handleQuery" v-model="queryParams.keyword" style="width: 200px"
                  placeholder="请输入歌手姓名"
                  clearable/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="queryParams.sex" placeholder="请选择歌手性别" clearable style="width: 200px">
          <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"/>
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
                   :disabled="singerIdList.length === 0"
                   icon="Delete"
                   @click="handleDelete(undefined)">批量删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 表格展示 -->
    <el-table border :data="singerList" @selection-change="handleSelectionChange" v-loading="loading">
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 歌手图片 -->
      <el-table-column prop="pic" label="歌手图片" align="center" width="100">
        <template #default="scope">
          <img :src="scope.row.pic" width="40" height="40"/>
        </template>
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <!-- 性别 -->
      <el-table-column prop="sex" label="性别" align="center" width="100">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.sex === 0">女</el-tag>
          <el-tag v-if="scope.row.sex === 1">男</el-tag>
          <el-tag type="danger" v-if="scope.row.sex === 2">保密</el-tag>
          <!--      <el-tag type="info" v-if="scope.row.loginType === 4">Github</el-tag>-->
        </template>
      </el-table-column>
      <!-- 出生日期 -->
      <el-table-column prop="birth" label="出生日期" align="center">
        <template #default="scope">
          <div class="create-time">
            <el-icon>
              <clock/>
            </el-icon>
            <span style="margin-left: 10px">{{ formatDate(scope.row.birth) }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 地区 -->
      <el-table-column prop="location" label="地区" align="center">

      </el-table-column>
      <!-- 简介 -->
      <el-table-column prop="introduction" label="简介" align="center" width="220">
        <template #default="scope">
          <el-text line-clamp="3">{{ scope.row.introduction }}</el-text>
        </template>
      </el-table-column>
      <!-- 歌曲管理-->
      <el-table-column label="歌曲管理" align="center" width="220"></el-table-column>
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
      <el-form ref="singerFormRef" label-width="100px" :model="singerForm" :rules="rules">
        <!-- 歌手图片 -->
        <el-form-item label="歌手图片" prop="pic">
          <el-upload drag :show-file-list="false"
                     action
                     :http-request="handleUpload"
                     accept="image/*"
                     :before-upload="beforeUpload"
                     :on-success="handleSuccess">
            <el-icon class="el-icon--upload" v-if="singerForm.pic === ''">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text" v-if="singerForm.pic === ''">
              将图片拖到此处，或<em>点击上传</em>
            </div>
            <img v-else :src="singerForm.pic" width="360"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入歌手名" v-model="singerForm.name" style="width: 250px;"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="singerForm.sex">
            <el-radio v-for="dict in sexList" :key="dict.value" :label="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker v-model="singerForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地区" prop="location">
          <template #default="scope">
            <!--国家选择-->
            <foreign-area v-model="singerForm.location"></foreign-area>
          </template>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" v-model="singerForm.introduction" :autosize="{ minRows: 4}"></el-input>
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

import {onMounted, reactive, ref, toRefs} from "vue";
import {FormInstance, FormRules, UploadRawFile, UploadRequestOptions} from "element-plus";
import {Singer, SingerForm, SingerQuery} from "@/api/singer/types";
import {addSinger, deleteSinger, getSingerList, updateSinger} from "@/api/singer";
import {messageConfirm, notifySuccess} from "@/utils/modal";
import {formatDate} from "@/utils/date";
import {Clock, UploadFilled} from "@element-plus/icons-vue";
import {AxiosResponse} from "axios";
import * as imageConversion from 'image-conversion';
import {uploadSingerPic} from "@/api/upload";
import foreignArea from "@/components/ForeignArea/index.vue";
import {Role} from "@/api/role/types";

const singerFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{required: true, message: "请输入歌手名", trigger: "blur"}],
});
const data = reactive({
  count: 0,
  title: "",
  loading: false,
  addOrUpdate: false,
  showSearch: true,
  protoLocation: [],
  queryParams: {
    current: 1,
    size: 10,
  } as SingerQuery,
  singerIdList: [] as number[],
  singerList: [] as Singer[],
  singerForm: {} as SingerForm,
  sexList: [
    {
      value: 0,
      label: "女"
    },
    {
      value: 1,
      label: "男"
    },
    {
      value: 2,
      label: "保密"
    }
  ]
});
const {
  count,
  title,
  addOrUpdate,
  loading,
  showSearch,
  queryParams,
  singerIdList,
  singerList,
  singerForm,
  sexList
} = toRefs(data);
const handleSelectionChange = (selection: Singer[]) => {
  singerIdList.value = selection.map((item) => item.id);
};
const handleSuccess = (response: AxiosResponse) => {
  singerForm.value.pic = response.data.data;
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
const openModel = (singer?: Singer) => {
  // todo 歌手对应歌曲id
  singerIdList.value = [];
  if (singer !== undefined) {
    title.value = "修改角色";
    singerForm.value.id = singer.id;
    singerForm.value.name = singer.name;
    singerForm.value.sex = singer.sex;
    singerForm.value.birth = singer.birth;
    singerForm.value.location = singer.location;
    singerForm.value.introduction = singer.introduction;
    singerForm.value.pic = singer.pic;
  } else {
    title.value = "添加角色";
    singerForm.value = {
      id: undefined,
      name: "",
      sex: 2,
      birth: "",
      pic: "",
      location: "",
      introduction: ""
    };
  }
  singerFormRef.value?.clearValidate();
  addOrUpdate.value = true;
};
const handleDelete = (id?: number) => {
  let ids: number[] = [];
  if (id === undefined) {
    ids = singerIdList.value;
  } else {
    ids = [id];
  }
  messageConfirm("确认删除已选中的数据项?").then(() => {
    deleteSinger(ids).then(({data}) => {
      if (data.flag) {
        notifySuccess(data.msg);
        getList();

      }
    });
  }).catch(() => {
  });
};
const submitForm = () => {
  singerFormRef.value?.validate((valid) => {
    if (valid) {
      singerForm.value.location = singerForm.value.location.toString();
      if (singerForm.value.location.startsWith(",")) {
        singerForm.value.location = singerForm.value.location.substring(1);
      }
      if (singerForm.value.id !== undefined) {
        updateSinger(singerForm.value).then(({data}) => {
          if (data.flag) {
            notifySuccess(data.msg);
            getList();
          }
          addOrUpdate.value = false;
        })
      } else {
        if (singerForm.value.location.startsWith(",")) {
          singerForm.value.location = singerForm.value.location.substring(1);
        }
        addSinger(singerForm.value).then(({data}) => {
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
  getSingerList(queryParams.value).then(({data}) => {
    singerList.value = data.data.recordList;
    count.value = data.data.count;
    loading.value = false;
  })
};
const handleQuery = () => {
  queryParams.value.current = 1;
  getList();
};

onMounted(() => {
  getList();
});
</script>

<style scoped>

</style>