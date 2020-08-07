<template lang="pug">
.class-container
  the-title-and-search(:title="['班级列表']")
  .table-container
    a-table(
      :loading="queryClassLoading",
      :columns="columns",
      :data-source="classInfo.list",
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }",
      bordered,
      rowKey="id"
      :pagination="pagination"
    )
      template(slot="student")
        a 查看
      template(slot="action")
        .option(style="width:60.5px;")
          .option-container(style="margin-left:0;")
            a-icon(type="iconbianji4")
            span 编辑
        .option
          .option-container
            a-icon(type="icondaoru2")
            span 导入
        .option(style="border:0")
          .option-container
            a-icon(type="iconshanchu")
            span 删除
    .btn-container(v-if="classInfo.list ? classInfo.list.length : false")
      a-button(type="primary", @click="onCreateClass") 新建
      a-button(type="primary") 下载学生模板
      a-button(type="primary") 删除
      a-modal(
        v-model="createClassVisiable",
        title="创建班级",
        @cancel="createClassCancel",
        :loading="createClassOk",
      )
        a-form-model(
          ref="createClassRuleForm",
          :rules="createClassRules",
          :label-col="labelCol",
          :wrapper-col="wrapperCol",
          :model="createClassQuery"
        )
          a-form-model-item(label="班级名称", prop="name")
            a-input(v-model="createClassQuery.name", placeholder="请输入班级名称")
          a-form-model-item(label="班级描述", prop="remarks")
            a-input(
              v-model="createClassQuery.remarks",
              type="textarea",
              placeholder="请输入内容"
            )
          a-form-model-item(label="任课教师", prop="teacherCodes")
            a-select(v-model="createClassQuery.teacherCodes" placeholder="请选择",mode="multiple")
              a-select-option(v-for="(item,index) of teacherList.list" :key="index" :value='item.code') {{item.name}}
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import {
  Input,
  Icon,
  Table,
  Button,
  Modal,
  FormModel,
  Select,
} from 'ant-design-vue-findsoft';

Vue.use(FormModel);
Vue.use(Select);
// eslint-disable-next-line
const MyIcon: any = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1988509_8oiezscvohb.js',
});

export default Vue.extend({
  components: {
    aInput: Input,
    aIcon: MyIcon,
    aTable: Table,
    aButton: Button,
    aModal: Modal,
    TheTitleAndSearch: () => import('@/components/Teacher/Ui/TitleAndSearch.vue'),
  },
  async created() {
    if (this.role === 'admin') {
      await this.getClassInfo({
        pageNo: 1,
      });
      await this.queryUserList(this.queryTeacher);
      this.queryClassLoading = false;
    }
  },
  data() {
    return {
      queryClassLoading: true,
      queryTeacher: {
        pageNo: 1,
        pageSize: 10,
        queryParam: {
          role: '1',
          name: '',
        },
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      createClassVisiable: false,
      pagination: { showQuickJumper: true },
      selectedRowKeys: [],
      columns: [
        {
          title: '班级名称',
          dataIndex: 'name',
          width: '25%',
        },
        {
          title: '班级人数',
          dataIndex: 'stuNum',
          align: 'center',
          width: '10%',
        },
        {
          title: '学生明细',
          dataIndex: 'classStudent',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'student' },
        },
        {
          title: '所属教师',
          dataIndex: 'userNames',
          width: '30%',
        },
        {
          title: '操作',
          key: 'action',
          width: '25%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      createClassQuery: {
        disable: false,
        name: '',
        remarks: '',
        teacherCodes: [],
      },
      createClassRules: {
        name: [
          { required: true, message: '请填写班级名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '班级名称只能在2-20个字之间',
            trigger: 'blur',
          },
        ],
        remarks: [
          { required: true, message: '请填写班级描述', trigger: 'blur' },
          {
            min: 2,
            max: 200,
            message: '班级描述只能在2-20个字之间',
            trigger: 'blur',
          },
        ],
        teacherCodes: [
          { required: true, message: '请选择教师', trigger: 'blur' },
          {
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions('UserController', ['queryUserList']),
    ...mapActions('ClassController', ['getClassInfo', 'updateClassInfo']),
    createClassCancel() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.createClassRuleForm as any).resetFields();
      this.createClassQuery.teacherCodes = [];
      this.createClassVisiable = false;
    },
    createClassOk() {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.$refs.createClassRuleForm as any).validate((valid: boolean) => {
          if (valid) {
            console.log(valid);
            console.log(this.createClassQuery);
            this.updateClassInfo(this.createClassQuery)
              .then((res) => {
                console.log(res);
                this.createClassVisiable = false;
                this.$message.success('创建成功');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.$refs.createClassRuleForm as any).resetFields();
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          }
          reject();
        });
      });
    },
    onCreateClass() {
      this.createClassVisiable = true;
    },
    onSelectChange(selectedRowKeys: never[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
  computed: {
    ...mapGetters('ClassController', ['classInfo']),
    ...mapGetters('UserController', ['role', 'teacherList']),
  },
});
</script>

<style lang="stylus" scoped>
.table-container
  position relative
  width 1180px
  margin-top 24px
  font-family 'MicrosoftYaHeiUI'
  .btn-container
    display flex
    justify-content space-between
    position absolute
    bottom 16px
    width 268px
  .option
    display inline-block
    width 72px
    border-right 1px solid rgba(216, 216, 216, 1)
    .option-container
      display flex
      align-items center
      justify-content space-between
      width 48px
      margin auto
      cursor pointer
      color rgba(74, 144, 226, 1)
      .anticon
        font-size 16px
      span
        display inline-block
        width 28px
        height 18px
        line-height 18px
</style>
