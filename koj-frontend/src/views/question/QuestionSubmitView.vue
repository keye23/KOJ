<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeResult="{ record }">
        {{ getJudgeResult(record) }}
      </template>
      <template #judgeTime="{ record }">
        {{ formatJudgeMetric(record.judgeInfo?.time, "ms") }}
      </template>
      <template #judgeMemory="{ record }">
        {{ formatJudgeMetric(record.judgeInfo?.memory, "KB") }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";

const tableRef = ref();

const dataList = ref<QuestionSubmitVO[]>([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

let requestId = 0;

const loadData = async () => {
  const currentRequestId = ++requestId;
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (currentRequestId !== requestId) {
    return;
  }
  if (res.code === 0) {
    dataList.value = res.data?.records ?? [];
    total.value = res.data?.total ?? 0;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const getJudgeResult = (record: QuestionSubmitVO) => {
  if (record?.judgeInfo?.message) {
    return record.judgeInfo.message;
  }
  if (record?.status === 0) {
    return "Waiting";
  }
  if (record?.status === 1) {
    return "Running";
  }
  if (record?.status === 3) {
    return "System Error";
  }
  return "-";
};

const formatJudgeMetric = (value?: number, unit?: string) => {
  if (value === undefined || value === null) {
    return "-";
  }
  return unit ? `${value} ${unit}` : value;
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watch(searchParams, loadData, { immediate: true, deep: true });

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题结果",
    slotName: "judgeResult",
  },
  {
    title: "执行时间",
    slotName: "judgeTime",
  },
  {
    title: "内存消耗",
    slotName: "judgeMemory",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
