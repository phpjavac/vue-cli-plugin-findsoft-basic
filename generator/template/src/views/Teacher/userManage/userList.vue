<template lang="pug">
.class-container
  the-title-and-search(:title='title', @change='changeTabActive')
    template(slot='button')
      .btn-container
        a-button(type='primary', @click='addUserType')
          .button-content
            a-icon(type='iconjia')
            span 新建
        a-button(type='default', ghost)
          .button-content(@click='deleteUser')
            a-icon(type='iconshanchu')
            span 删除
    template(slot='search')
      search-bar(@inputSearch='onSearch')
  .table-container
    a-table(
      v-if='activeTab === 0',
      :columns='teacherColumns',
      size='middle',
      :data-source='teacherList.list',
      :loading='queryTeacherLoading',
      rowKey='code',
      :pagination='pagination',
      :row-selection='{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }',
      @change='pageChange'
    )
      template(slot='operation', slot-scope='row')
        .option
          .option-container
            span(@click='editUser(row)') 编辑
          .line
          .option-container
            span(@click='reset(row)') 重置密码
          .line
          .option-container(@click='deleteTea(row)')
            span 删除
    a-table(
      v-if='activeTab === 1',
      :columns='studentColumns',
      :data-source='studentList.list',
      :loading='queryTeacherLoading',
      size='middle',
      :pagination='pagination',
      rowKey='userId',
      :row-selection='{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }',
      @change='pageChange'
    )
      template(slot='operation', slot-scope='row')
        .option
          .option-container
            span(@click='editUser(row)') 编辑
          .line
          .option-container
            span(@click='reset(row)') 重置密码
          .line
          .option-container(@click='deleteStu(row)')
            span 删除
    a-modal(
      v-model='addTeacherVisible',
      @cancel='addTeacherCancel',
      :title='addTeacherTitle',
      :loading='addTeacherOk'
    )
      a-form-model(
        :model='addTeacherForm',
        :label-col='labelCol',
        ref='addTeacherRuleForm',
        :rules='addTeacherRules',
        :wrapper-col='wrapperCol'
      )
        a-form-model-item(label='账号', prop='code')
          a-input(
            v-model='addTeacherForm.code',
            :disabled='!addTeacherTitle.includes("添加")'
          )
        a-form-model-item(label='姓名', prop='name')
          a-input(v-model='addTeacherForm.name')
        a-form-model-item(label='密码', v-if='addTeacherTitle.includes("添加")')
          div 初始密码为123456
    a-modal(
      v-model='addStudentVisible',
      @cancel='addStudentCancel',
      :title='addTeacherTitle',
      :loading='addStudentOk'
    )
      a-form-model(
        :model='addStudentForm',
        :label-col='labelCol',
        ref='addStudentRuleForm',
        :rules='addStudentRules',
        :wrapper-col='wrapperCol'
      )
        a-form-model-item(label='账号', prop='code')
          a-input(
            v-model='addStudentForm.code',
            :disabled='!addTeacherTitle.includes("添加")'
          )
        a-form-model-item(label='姓名', prop='name')
          a-input(v-model='addStudentForm.name')
        a-form-model-item(label='班级', prop='classId')
          a-select(
            v-model='addStudentForm.classId',
            :disabled='!addTeacherTitle.includes("添加")'
          )
            a-select-option(
              v-for='item in classInfo.list',
              :key='item.id',
              :value='item.id'
            ) {{ item.name }}
        a-form-model-item(label='密码', v-if='addTeacherTitle.includes("添加")')
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
  Pagination,
  message,
} from 'ant-design-vue-findsoft';

import { definitions } from '@/types/api.d';

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
    {
      required: true,
      message: '请填写账号',
      trigger: 'blur',
    },
    {
      min: 2,
      max: 20,
      message: '账号只能在2-20个字之间',
      trigger: 'blur',
    },
    {
      pattern: new RegExp(/^[0-9a-zA-Z]+$/),
      message: '账号只能为数字或英文',
      trigger: 'change',
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
  scriptUrl: './static/iconfont/font_1988509/iconfont.js',
});

export default Vue.extend({
  data() {
    return {
      addTeacherTitle: '添加教师',
      teacherPagination: {
        showQuickJumper: true,
        total: 0,
      },
      studentPagination: {
        showQuickJumper: true,
        total: 0,
      },
      activeTab: 0,
      pagination: {
        total: 0,
        current: 1,
      } as Pagination,
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
          ellipsis: 'true',
          width: '10%',
        },
        {
          title: '教师姓名',
          ellipsis: 'true',
          dataIndex: 'name',
          width: '65%',
        },
        {
          title: '操作',
          ellipsis: 'true',
          width: '15%',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      studentColumns: [
        {
          title: '账号',
          ellipsis: 'true',
          dataIndex: 'userId',
          width: '15%',
        },
        {
          title: '姓名',
          ellipsis: 'true',
          dataIndex: 'name',
          width: '10%',
        },
        {
          title: '班级',
          ellipsis: 'true',
          dataIndex: 'className',
          width: '50%',
        },
        {
          title: '操作',
          width: '15%',
          ellipsis: 'true',
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
      'resetPassword',
      'changeUserInfo',
      'delTeaUser',
      'delStuUser',
    ]),
    // 搜索
    async onSearch(value: string) {
      this.queryTeacherLoading = true;
      if (this.activeTab === 0 && this.role === 'admin') {
        this.queryTeacher = {
          pageNo: 1,
          pageSize: 10,
          queryParam: {
            role: '1',
            name: '',
          },
        };
        this.queryTeacher.queryParam.name = value;
        const res = await this.queryUserList(this.queryTeacher);
        this.teacherPagination.total = res.totalRecords;
        this.pagination.total = res.totalRecords;
      } else if (this.activeTab === 1) {
        let teacherId;
        if (this.role !== 'admin') {
          teacherId = this.code;
        }
        const data = await this.queryStudentList({
          teacherId,
          keyWord: value,
        });
        console.log(data);

        this.studentPagination.total = data.totalRecords;
      }
      message.success('查询成功');
      this.queryTeacherLoading = false;
    },
    // 分页切换
    async pageChange(val: Pagination) {
      this.pagination.current = val.current;
      if (this.activeTab === 0) {
        this.queryTeacher.pageNo = val.current || 1;
        this.queryTeacherLoading = true;
        await this.queryUserList(this.queryTeacher);
        this.queryTeacherLoading = false;
      } else {
        this.queryStudentData.pageNo = val.current || 1;
        this.queryTeacherLoading = true;

        await this.queryStudentList(this.queryStudentData);
        this.queryTeacherLoading = false;
      }
    },
    // 切换教师/学生表格
    async changeTabActive(name: string) {
      this.selectedRowKeys = [];
      this.queryStudentData.pageNo = 1;
      this.queryTeacher.pageNo = 1;
      this.pagination.current = 1;
      if (name === '教师列表') {
        this.activeTab = 0;
        this.queryTeacherLoading = true;
        const { totalRecords } = await this.queryUserList(this.queryTeacher);
        this.pagination.total = totalRecords;
        this.queryTeacherLoading = false;
      } else {
        this.activeTab = 1;
        if (this.role !== 'admin') {
          this.queryStudentData.teacherId = this.code;
        }
        this.queryTeacherLoading = true;

        const { totalRecords } = await this.queryStudentList(
          this.queryStudentData
        );
        this.queryTeacherLoading = false;

        this.pagination.total = totalRecords;
      }
    },
    // 添加学生确定
    addStudentOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.addStudentRuleForm as FormModel).validate((valid) => {
          if (valid) {
            if (!this.addTeacherTitle.includes('添加')) {
              const data = {
                code: this.addStudentForm.code,
                name: this.addStudentForm.name,
              };
              this.changeUserInfo(data)
                .then(async () => {
                  await this.queryStudentList(this.queryStudentData);
                  this.addStudentCancel();
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              const data = {
                userId: this.addStudentForm.code,
                classId: this.addStudentForm.classId,
                isTeacher: this.addStudentForm.isTeacher,
                name: this.addStudentForm.name,
              };
              this.createClassMember(data)
                .then(async (res) => {
                  this.queryTeacherLoading = true;

                  const { totalRecords } = await this.queryStudentList(
                    this.queryStudentData
                  );
                  this.queryTeacherLoading = false;
                  this.pagination.total = totalRecords;
                  this.addStudentCancel();
                  console.log(res);
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            }
          }
        });
        reject();
      });
    },
    // 添加教师确定
    addTeacherOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.addTeacherRuleForm as FormModel).validate((valid) => {
          if (valid) {
            // 编辑用户
            if (!this.addTeacherTitle.includes('添加')) {
              const data = {
                code: this.addTeacherForm.code,
                name: this.addTeacherForm.name,
              };
              this.changeUserInfo(data)
                .then(async () => {
                  await this.queryUserList(this.queryTeacher);
                  this.addTeacherCancel();
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              // 添加
              this.addUser(this.addTeacherForm)
                .then(async () => {
                  const { totalRecords } = await this.queryUserList(
                    this.queryTeacher
                  );
                  this.pagination.total = totalRecords;
                  this.addTeacherCancel();
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            }
          }
          reject();
        });
      });
    },
    // 新建用户
    addUserType() {
      if (this.activeTab === 0) {
        this.addTeacherTitle = '添加教师';
        this.addTeacherVisible = true;
      } else {
        this.addTeacherTitle = '添加学生';
        this.addStudentVisible = true;
      }
    },
    // 删除教师用户
    deleteTea(val: { code: string }) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '删除用户',
          content: '是否删除该用户？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.delTeaUser({ ids: JSON.stringify([val.code]) })
              .then(async () => {
                this.pageChange(this.pagination);
                const { totalRecords } = await this.queryUserList(
                  this.queryTeacher
                );
                this.pagination.total = totalRecords;
                resolve();
                console.log('OK');
              })
              .catch((err) => {
                reject(err);
              });
          },
          onCancel() {
            resolve();
          },
        });
      });
    },
    // 删除学生用户

    deleteStu(val: { userId: string }) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '删除用户',
          content: '是否删除该用户？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.delStuUser({ ids: JSON.stringify([val.userId]) })
              .then(async () => {
                const { totalRecords } = await this.queryStudentList(
                  this.queryStudentData
                );
                this.pagination.total = totalRecords;
                this.pageChange(this.pagination);
                resolve();
                console.log('OK');
              })
              .catch((err) => {
                reject(err);
              });
          },
          onCancel() {
            resolve();
          },
        });
      });
    },
    // 批量删除用户
    deleteUser() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          message.info('请先选择要删除的用户');
          resolve();
          return;
        }
        Modal.confirm({
          title: '删除用户',
          content: '是否删除用户？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            console.log(this.selectedRowKeys);
            if (this.activeTab === 0) {
              // 教师
              this.delTeaUser({ ids: JSON.stringify(this.selectedRowKeys) })
                .then(async () => {
                  const { totalRecords } = await this.queryUserList(
                    this.queryTeacher
                  );
                  this.pagination.total = totalRecords;
                  this.selectedRowKeys = [];
                  this.pageChange(this.pagination);
                  resolve();
                  console.log('OK');
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              // 学生
              this.delStuUser({ ids: JSON.stringify(this.selectedRowKeys) })
                .then(async () => {
                  const { totalRecords } = await this.queryStudentList(
                    this.queryStudentData
                  );
                  this.pagination.total = totalRecords;
                  this.selectedRowKeys = [];
                  this.pageChange(this.pagination);
                  resolve();
                  console.log('OK');
                })
                .catch((err) => {
                  reject(err);
                });
            }
          },
          onCancel() {
            resolve();
          },
        });
      });
    },
    // 取消添加教师弹框
    addTeacherCancel() {
      this.addTeacherVisible = false;
      (this.$refs.addTeacherRuleForm as FormModel).resetFields();
      this.addTeacherForm = {
        code: '',
        isTeacher: true,
        name: '',
      };
    },
    // 取消添加学生弹框
    addStudentCancel() {
      this.addStudentVisible = false;
      (this.$refs.addStudentRuleForm as FormModel).resetFields();
      this.addStudentForm = {
        code: '',
        isTeacher: false,
        name: '',
        classId: '',
      };
    },
    // 编辑用户
    editUser(row: {
      code: string;
      isTeacher: boolean;
      name: string;
      classId: string;
      userId: string;
    }) {
      if (this.activeTab === 0) {
        this.addTeacherForm = { ...row };
        this.addTeacherTitle = '编辑教师';
        this.addTeacherVisible = true;
      } else {
        row.code = row.userId;
        this.addTeacherTitle = '编辑学生';
        this.addStudentForm = { ...row };
        this.addStudentVisible = true;
      }
    },
    // 表格选择回调
    onSelectChange(selectedRowKeys: never[]) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 重置用户密码
    reset(row: { userId?: string; code?: string; name?: string }) {
      Modal.confirm({
        title: '系统提示',
        content: `你确定要把该用户(${row.name})的密码重置为123456吗?`,
        onOk: () =>
          new Promise((resolve, reject) => {
            this.resetPassword({ code: row.userId || row.code })
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          }),
        onCancel() {
          console.log('Cancel');
        },
      });
    },
  },
  components: {
    TheTitleAndSearch: () =>
      import('@/components/Teacher/Ui/TitleAndSearch.vue'),
    SearchBar: () => import('@/components/Teacher/Ui/SearchBar.vue'),
    aTable: Table,
    aIcon: MyIcon,
    aButton: Button,
    aModal: Modal,
    aInput: Input,
  },
  async created() {
    this.$store.dispatch('ClassController/getClassInfo', {
      pageNo: 1,
    });
    if (this.role === 'admin') {
      const { totalRecords } = await this.queryUserList(this.queryTeacher);
      this.pagination.total = totalRecords;
      this.queryTeacherLoading = false;
    } else {
      this.activeTab = 1;
      this.queryTeacherLoading = true;
      this.queryStudentData.teacherId = this.code;
      const { totalRecords } = await this.queryStudentList(
        this.queryStudentData
      );
      this.queryTeacherLoading = false;
      this.pagination.total = totalRecords;
    }
  },
});
</script>
<style lang="stylus" scoped>
>>>.ant-btn
  width 78px
>>>.ant-btn-default
  color #40a9ff
  border-color #40a9ff
.btn-container
  display flex
  justify-content space-between
  width 168px
  font-size 14px
  .button-content
    display flex
    justify-content space-between
    align-items center
    width 46px
    span
      letter-spacing 0
.table-container
  margin-top 22px
  position relative
  .option
    display flex
    justify-content space-between
    padding-right 10%
    align-items center
    .line
      width 1px
      height 14px
      background rgba(216, 216, 216, 1)
    .option-container
      cursor pointer
      color rgba(74, 144, 226, 1)
      .anticon
        font-size 16px
      span
        display inline-block
        height 18px
        line-height 18px
</style>
