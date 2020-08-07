<template lang="pug">
.class-container
  the-title-and-search(:title="title", @change="changeTabActive")
  .table-container
    a-table(
      v-if="activeTab === 0",
      :columns="teacherColumns",
      :data-source="teacherList.list",
      :loading="queryTeacherLoading",
      rowKey="code",
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    )
      template(slot="operation")
        .option
          .option-container(style="margin-left:0;")
            a-icon(type="iconbianji4")
            span 编辑
          .option-container
            a-icon(type="iconzhongzhi")
            span 重置密码
          .option-container
            a-icon(type="iconshanchu")
            span 删除
    a-table(
      v-if="activeTab === 1",
      :columns="studentColumns",
      :data-source="studentList.list",
      :loading="queryTeacherLoading",
      rowKey="userId",
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    )
      template(slot="operation")
        .option
          .option-container(style="margin-left:0;")
            a-icon(type="iconbianji4")
            span 编辑
          .option-container
            a-icon(type="iconzhongzhi")
            span 重置密码
          .option-container
            a-icon(type="iconshanchu")
            span 删除
    .btn-container
      a-button(type="primary", @click="addUserType") 新建
      a-button(type="primary") 删除
    a-modal(
      v-model="addTeacherVisible",
      @cancel="addTeacherCancel",
      title="添加教师",
      :loading="addTeacherOk"
    )
      a-form-model(
        :model="addTeacherForm",
        :label-col="labelCol",
        ref="addTeacherRuleForm",
        :rules="addTeacherRules",
        :wrapper-col="wrapperCol"
      )
        a-form-model-item(label="账号", prop="code")
          a-input(v-model="addTeacherForm.code")
        a-form-model-item(label="姓名", prop="name")
          a-input(v-model="addTeacherForm.name")
        a-form-model-item(label="密码")
          div 初始密码为123456
    a-modal(
      v-model="addStudentVisible",
      @cancel="addStudentCancel",
      title="添加学生",
      :loading="addStudentOk"
    )
      a-form-model(
        :model="addStudentForm",
        :label-col="labelCol",
        ref="addStudentRuleForm",
        :rules="addStudentRules",
        :wrapper-col="wrapperCol"
      )
        a-form-model-item(label="账号", prop="code")
          a-input(v-model="addStudentForm.code")
        a-form-model-item(label="姓名", prop="name")
          a-input(v-model="addStudentForm.name")
        a-form-model-item(label="班级", prop="classId")
          a-select(v-model="addStudentForm.classId")
            a-select-option(
              v-for="item in classInfo.list",
              :key="item.id",
              :value="item.id"
            ) {{ item.name }}
        a-form-model-item(label="密码")
          div 初始密码为123456
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import {
  Table,
  Button,
  Modal,
  FormModel,
  Input,
  Select,
  Icon,
} from 'ant-design-vue-findsoft';
import { definitions } from '../../../types/api.d';

class AddRules {
  name = [
    { required: true, message: '请填写姓名', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '姓名只能在2-20个字之间',
      trigger: 'blur',
    },
  ];

  code = [
    { required: true, message: '请填写账号', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '账号只能在2-20个字之间',
      trigger: 'blur',
    },
  ];
}
class AddStudentRules extends AddRules {
  classId = [{ required: true, message: '请选择班级', trigger: 'change' }];
}
Vue.use(Select);
Vue.use(FormModel);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyIcon: any = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1988509_8oiezscvohb.js',
});

export default Vue.extend({
  data() {
    return {
      activeTab: 0,
      queryStudentData: {
        pageNo: 1,
        pageSize: 10,
      } as definitions['ListClassMemberRequest'],
      queryTeacherLoading: true,
      queryTeacher: {
        pageNo: 1,
        pageSize: 10,
        queryParam: {
          role: '1',
          name: '',
        },
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      addTeacherVisible: false,
      addStudentVisible: false,
      teacherColumns: [
        {
          title: '账号',
          dataIndex: 'code',
          width: '10%',
          scopedSlots: { customRender: 'code' },
        },
        {
          title: '教师姓名',
          dataIndex: 'name',
          width: '65%',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '操作',
          width: '25%',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      studentColumns: [
        {
          title: '账号',
          dataIndex: 'userId',
          width: '15%',
          scopedSlots: { customRender: 'userId' },
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '10%',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '班级',
          dataIndex: 'className',
          width: '50%',
          scopedSlots: { customRender: 'className' },
        },
        {
          title: '操作',
          width: '25%',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      addTeacherForm: {
        code: '',
        isTeacher: true,
        name: '',
      },
      addStudentForm: {
        code: '',
        isTeacher: false,
        name: '',
        classId: '',
      },
      addStudentRules: new AddStudentRules(),
      addTeacherRules: new AddRules(),
    };
  },
  computed: {
    title(): string[] {
      let title = [];
      switch (this.role) {
        case 'admin':
          title = ['教师列表', '学生列表'];
          break;

        default:
          title = ['学生列表'];

          break;
      }
      return title;
    },
    ...mapGetters('UserController', [
      'role',
      'teacherList',
      'code',
      'studentList',
    ]),
    ...mapGetters('ClassController', ['classInfo']),
  },
  methods: {
    ...mapActions('UserController', [
      'addUser',
      'queryUserList',
      'queryStudentList',
      'createClassMember',
    ]),
    changeTabActive(name: string) {
      if (name === '教师列表') {
        this.activeTab = 0;
      } else {
        this.activeTab = 1;
        if (this.role !== 'admin') {
          this.queryStudentData.teacherId = this.code;
        }
        this.queryStudentList(this.queryStudentData);
      }
    },
    addStudentOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.addStudentRuleForm as FormModel).validate((valid) => {
          if (valid) {
            const data = {
              userId: this.addStudentForm.code,
              classId: this.addStudentForm.classId,
              isTeacher: this.addStudentForm.isTeacher,
              name: this.addStudentForm.name,
            };
            this.createClassMember(data)
              .then((res) => {
                this.addStudentCancel();
                console.log(res);
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          }
        });
        reject();
      });
    },
    addTeacherOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.addTeacherRuleForm as FormModel).validate((valid) => {
          if (valid) {
            this.addUser(this.addTeacherForm)
              .then(async () => {
                await this.queryUserList(this.queryTeacher);
                this.addTeacherCancel();
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
    // 新建教师
    addUserType() {
      console.log(this.activeTab);

      if (this.activeTab === 0) {
        this.addTeacherVisible = true;
      } else {
        this.addStudentVisible = true;
      }
    },
    // 取消添加教师弹框
    addTeacherCancel() {
      (this.$refs.addTeacherRuleForm as FormModel).resetFields();
      this.addTeacherVisible = false;
    },
    addStudentCancel() {
      (this.$refs.addStudentRuleForm as FormModel).resetFields();
      this.addStudentVisible = false;
    },
    onSelectChange(selectedRowKeys: never[]) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
  },
  components: {
    TheTitleAndSearch: () => import('@/components/Teacher/Ui/TitleAndSearch.vue'),
    aTable: Table,
    aIcon: MyIcon,
    aButton: Button,
    aModal: Modal,
    aInput: Input,
  },
  async created() {
    if (this.role === 'admin') {
      this.$store.dispatch('ClassController/getClassInfo', { pageNo: 1 });
      await this.queryUserList(this.queryTeacher);
      this.queryTeacherLoading = false;
    }
  },
});
</script>
<style lang="stylus" scoped>
.table-container
  margin-top 22px
  position relative
  .option
    display: flex;
    .option-container
      display flex
      align-items center
      justify-content flex-start
      margin auto
      cursor pointer
      color rgba(74, 144, 226, 1)
      .anticon
        font-size 16px
      span
        display inline-block
        height 18px
        line-height 18px
</style>
