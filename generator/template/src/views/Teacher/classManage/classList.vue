<template lang="pug">
.class-container
  the-title-and-search(:title="['班级列表']")
    template(slot="button")
      .btn-container
        a-button(type="primary", @click="onCreateClass")
          a-icon(type="iconjia")
          span 新建
        a-button(type="primary")
          a-icon(type="iconxiazai")
          a(href="./static/students.xls") 下载学生模板
        a-button(type="default" ghost @click="deleteClasses")
          a-icon(type="iconshanchu")
          span 删除
        a-modal(
          v-model="createClassVisiable",
          title="创建班级",
          @cancel="createClassCancel",
          :loading="createClassOk",
        )
          a-form-model(
            ref="createClassRuleForm",
            :rules="classRules",
            :label-col="labelCol",
            :wrapper-col="wrapperCol",
            :model="classQuery"
          )
            a-form-model-item(label="班级名称", prop="name")
              a-input(v-model="classQuery.name", placeholder="请输入班级名称")
            a-form-model-item(label="班级描述", prop="remarks")
              a-input(
                v-model="classQuery.remarks",
                type="textarea",
                placeholder="请输入内容",:maxLength="500"
              )
            a-form-model-item(label="任课教师", prop="teacherCodes")
              a-select(:disabled="role!=='admin'" v-model="classQuery.teacherCodes" placeholder="请选择")
                a-select-option(v-for="(item,index) of teacherList.list" :key="index"  :value='item.code') {{item.name}}
        a-modal(
          v-model="editClassVisiable",
          title="编辑班级",
          @cancel="editClassCancel",
          :loading="editClassOk",
          destroyOnClose
        )
          a-form-model(
            ref="editClassRuleForm",
            :rules="classRules",
            :label-col="labelCol",
            :wrapper-col="wrapperCol",
            :model="classQuery"
          )
            a-form-model-item(label="班级名称", prop="name")
              a-input(v-model="classQuery.name", placeholder="请输入班级名称")
            a-form-model-item(label="班级描述", prop="remarks")
              a-input(
                v-model="classQuery.remarks",
                type="textarea",
                placeholder="请输入内容",:maxLength="500"
              )
            a-form-model-item(label="任课教师", prop="teacherCodes")
              a-select(:disabled="role!=='admin'" v-model="classQuery.teacherCodes"  placeholder="请选择")
                a-select-option(v-if="role==='admin'" v-for="(item,index) of teacherList.list" :key="index" :value='item.code') {{item.name}}
        a-modal(
          :width="800",
          v-model="classMemberVisiable",
          title="学生明细",
          destroyOnClose
        )
          a-table(rowKey="userId"
                  :columns="columns2"
                  :data-source="studentList"
                  :customRow="handleMemberRow"
                  :pagination="memberPagination"
                  @change="memberPageChange"
          )
            template(slot="deleteStudent")
              a-icon(type="iconshanchu" style="cursor: pointer;",@click="deleteStu")
            template(slot="editStudent")
              a-icon(type="iconbianji4" style="cursor: pointer;" @click="onEditClassMember")
          template(slot="footer")
            .btn-box
              a-button(type="primary" @click="onCreateMember") 创建
              div
                a-button(@click="editStudentCancel") 取消
                a-button(type="primary" @click="editStudentCancel") 确定

        a-modal(
          v-model="editClassMemberVisiable",
          title="编辑学生信息",
          :width="416"
          :loading="editClassMemberOk"
        )
          a-form-model(
            ref="memberRuleForm"
            :label-col="labelCol",
            :wrapper-col="wrapperCol",
            :model="memberQuery"
            :rules="memberRules"
          )
            a-form-model-item(label="班级" prop='className')
              a-input(v-model="memberQuery.className",disabled)
            a-form-model-item(label="账号" prop="userId")
              a-input(v-model="memberQuery.userId"  disabled)
            a-form-model-item(label="姓名" prop="name")
              a-input(v-model="memberQuery.name")
            a-form-model-item(label="密码")
              a(@click="resetPwd") 重置密码
              div 初始密码为123456
        a-modal(
          v-model="createMemberVisiable",
          title="添加学生",
          :width="416"
          :loading="onCreateMemberOk"
          @cancel="createMemberCancel"
        )
          a-form-model(
            ref="createMemberRuleForm"
            :label-col="labelCol",
            :wrapper-col="wrapperCol",
            :model="createMemberQuery"
            :rules="createMemberRules"
          )
            a-form-model-item(label="账号" prop="userId")
              a-input(v-model="createMemberQuery.userId")
            a-form-model-item(label="姓名" prop="name")
              a-input(v-model="createMemberQuery.name")
            a-form-model-item(label="密码")
              div 初始密码为123456

    template(slot="search")
      search-bar(@inputSearch='onSearch')
  .table-container
    a-table(
      :customRow="handleRow"
      :loading="queryClassLoading",
      :columns="columns",
      size="middle",
      :data-source="classInfo.list",
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }",
      rowKey="id"
      :pagination="pagination"
      @change="pageChange"
    )
      template(slot="student")
        a(@click="onClassStudent") 查看
      template(slot="action" slot-scope="row")
        .option
          .option-container(@click="onEdit")
            span 编辑
          .line
          .option-container
            a-upload(action="./api/classMember/insertStudent"
                    :data="{ classId: selectedId }"
                    :showUploadList="false"
                    :headers="{ token: token }",
                    :beforeUpload="onBeforeUpload"
                    @change="onUploadChange"
            ) 导入
          .line
          .option-container(@click="deleteClass(row)")
            span 删除

</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import {
  Input,
  Icon,
  Table,
  Button,
  Modal,
  FormModel,
  Select,
  message,
  Upload,
} from 'ant-design-vue-findsoft';

Vue.use(Upload);
Vue.use(FormModel);
Vue.use(Select);
// eslint-disable-next-line
const MyIcon: any = Icon.createFromIconfontCN({
  scriptUrl: './static/iconfont/font_1988509/iconfont.js',
});

export default Vue.extend({
  components: {
    aInput: Input,
    aIcon: MyIcon,
    aTable: Table,
    aButton: Button,
    aModal: Modal,
    TheTitleAndSearch: () => import('@/components/Teacher/Ui/TitleAndSearch.vue'),
    SearchBar: () => import('@/components/Teacher/Ui/SearchBar.vue'),
  },
  async created() {
    if (this.role === 'admin') {
      const res = await this.getClassInfo({
        pageNo: 1,
        pageSize: 10,
      });
      this.pagination.total = res.totalRecords;
      await this.queryUserList(this.queryTeacher);
      this.queryClassLoading = false;
      return;
    }
    const res = await this.getClassInfo({
      pageNo: 1,
      pageSize: 10,
    });
    this.pagination.total = res.totalRecords;
    console.log('res', res);
    // await this.queryUserList();
    this.queryClassLoading = false;
  },
  data() {
    return {
      isEdit: false,
      // 选中项id
      selectedId: '',
      queryClassLoading: true,
      queryTeacher: {
        pageNo: 1,
        queryParam: {
          role: '1',
          name: '',
        },
      },
      // 主页面分页器页码
      classPageNo: 1,
      // 学生明细分页器页码
      memberPageNo: 1,
      // 班级查询参数
      classQuery: {
        disable: false,
        name: '',
        remarks: '',
        teacherCodes: '',
      },
      // 学生明细查询参数
      memberQuery: {
        userId: '',
        name: '',
      },
      // 创建学生参数
      createMemberQuery: {
        classId: '',
        userId: '',
        name: '',
      },
      activeTab: 0,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      createMemberVisiable: false,
      editClassMemberVisiable: false,
      classMemberVisiable: false,
      editClassVisiable: false,
      createClassVisiable: false,
      pagination: {
        showQuickJumper: true,
        total: 0,
      },
      memberPagination: {
        showQuickJumper: true,
        total: 0,
      },
      selectedRowKeys: [],
      columns: [
        {
          title: '班级名称',
          dataIndex: 'name',
          width: '30%',
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
          width: '15%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      columns2: [
        {
          title: '账号',
          dataIndex: 'userId',
        },
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '删除',
          scopedSlots: { customRender: 'deleteStudent' },
        },
        {
          title: '编辑',
          scopedSlots: { customRender: 'editStudent' },
        },
      ],
      createMemberRules: {
        name: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '姓名只能在2-20个字之间',
            trigger: 'blur',
          },
        ],
        userId: [
          { required: true, message: '请填写账号', trigger: 'blur' },
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
        ],
      },
      memberRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            pattern: /^.{2,20}$/,
            message: '姓名只能是2-20位',
            trigger: 'blur',
          },
        ],
      },
      classRules: {
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
          {
            type: 'string',
            required: true,
            message: '请选择教师',
            trigger: 'blur',
          },
          {
            type: 'string',
            required: true,
            message: '请选择教师',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations('ClassMemberController', ['pulstudentList']),
    ...mapActions('UserController', [
      'queryUserList',
      'changeUserInfo',
      'addUser',
      'resetPassword',
      'delStuUser',

    ]),
    ...mapActions('ClassController', ['getClassInfo', 'updateClassInfo', 'delCls']),
    ...mapActions('ClassMemberController', [
      'insertStudent',
      'getClassStudent',
      'createOrUpdateMember',
    ]),
    async pageChange(pagination: { current: number; pageSize: number }) {
      this.classPageNo = pagination.current;
      if (this.role === 'admin') {
        this.queryClassLoading = true;
        await this.getClassInfo({
          pageNo: pagination.current,
          pageSize: pagination.pageSize,
        });
        this.queryClassLoading = false;
      }
    },
    async memberPageChange(pagination: { current: number; pageSize: number }) {
      this.memberPageNo = pagination.current;
      await this.getClassStudent({
        // eslint-disable-next-line @typescript-eslint/camelcase
        classRoom_uuid: this.selectedId,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      });
    },
    onBeforeUpload() {
      message.loading('正在导入');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onUploadChange(info: any) {
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          message.destroy();
          this.queryClassLoading = true;
          await this.getClassInfo({
            pageNo: this.classPageNo,
            pageSize: 10,
          });
          this.queryClassLoading = false;
          message.success('导入成功');
        } else {
          message.destroy();
          message.error(info.file.response.message);
        }
      } else if (info.file.status === 'error') {
        message.destroy();
        message.error('上传失败');
      }
    },
    // 创建学生
    async onCreateMemberOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.createMemberRuleForm as FormModel).validate((valid) => {
          if (valid) {
            this.createOrUpdateMember({
              classId: this.selectedId,
              userId: this.createMemberQuery.userId,
              name: this.createMemberQuery.name,
              isTeacher: false,
            })
              .then(async () => {
                this.createMemberVisiable = false;
                const res = await this.getClassStudent({
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  classRoom_uuid: this.selectedId,
                  pageNo: this.memberPageNo,
                  pageSize: 10,
                });
                this.memberPagination.total = res.totalRecords;
                await this.getClassInfo({
                  pageNo: this.classPageNo,
                  pageSize: 10,
                });
                (this.$refs.createMemberRuleForm as FormModel).resetFields();
                this.createMemberQuery = {
                  classId: '',
                  userId: '',
                  name: '',
                };
                resolve();
              })
              .catch((err) => {
                console.log(err);
                reject();
              });
          }
          reject();
        });
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleRow(record: any) {
      return {
        on: {
          click: () => {
            if (this.isEdit) {
              if (record.teacherCodes && record.teacherCodes.includes(',')) {
                // eslint-disable-next-line prefer-destructuring
                record.teacherCodes = record.teacherCodes.split(',')[0];
              }
              // 深拷贝
              this.classQuery = { ...record };
            }
          },
          mouseenter: () => {
            this.selectedId = record.id;
          },
        },
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleMemberRow(record: any) {
      return {
        on: {
          click: () => {
            this.memberQuery = { ...record };
          },
        },
      };
    },
    // 重置密码
    resetPwd() {
      Modal.confirm({
        title: '系统提示',
        content: `你确定要把该用户(${this.memberQuery.name})的密码重置为123456吗?`,
        onOk: () => new Promise((resolve, reject) => {
          this.resetPassword({ code: this.memberQuery.userId })
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
    // 搜索班级
    async onSearch(value: string) {
      this.queryClassLoading = true;
      const res = await this.getClassInfo({
        keyWord: value,
      });
      this.pagination.total = res.totalRecords;
      message.success('查询成功');
      this.queryClassLoading = false;
    },
    // 学生明细
    async onClassStudent() {
      this.classMemberVisiable = true;
      const res = await this.getClassStudent({
        // eslint-disable-next-line @typescript-eslint/camelcase
        classRoom_uuid: this.selectedId,
        pageNo: 1,
        pageSize: 10,
      });
      console.log(res, 'page');
      this.memberPagination.total = res.totalRecords;
    },
    // 学生明细取消
    editStudentCancel() {
      this.classMemberVisiable = false;
      this.pulstudentList([]);
    },
    onEditClassMember() {
      this.editClassMemberVisiable = true;
    },
    // 编辑班级信息
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEdit() {
      this.isEdit = true;
      this.editClassVisiable = true;
    },
    // 编辑学生
    editClassMemberOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.memberRuleForm as FormModel).validate((valid) => {
          if (valid) {
            const query = {
              code: this.memberQuery.userId,
              name: this.memberQuery.name,
            };
            this.changeUserInfo(query)
              .then(async () => {
                this.editClassMemberVisiable = false;
                await this.getClassStudent({
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  classRoom_uuid: this.selectedId,
                  pageNo: this.memberPageNo,
                  pageSize: 10,
                });
                resolve();
              })
              .catch((err) => {
                console.log(err);
                reject();
              });
          }
          reject();
        });
      });
    },
    // 编辑班级
    editClassOk() {
      return new Promise((resolve, reject) => {
        (this.$refs.editClassRuleForm as FormModel).validate((valid) => {
          if (valid) {
            const arr = [this.classQuery.teacherCodes];
            const queryList = {
              id: this.selectedId,
              disable: this.classQuery.disable,
              name: this.classQuery.name,
              remarks: this.classQuery.remarks,
              teacherCodes: JSON.stringify(arr),
            };
            console.log(queryList);
            this.updateClassInfo(queryList)
              .then(async () => {
                this.editClassVisiable = false;
                (this.$refs.editClassRuleForm as FormModel).resetFields();
                this.queryClassLoading = true;
                await this.getClassInfo({
                  pageNo: this.classPageNo,
                  pageSize: 10,
                });
                this.queryClassLoading = false;
                message.success('编辑成功');
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
    // 取消编辑班级信息
    editClassCancel() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.editClassRuleForm as FormModel).resetFields();
      this.classQuery.teacherCodes = '';
      this.editClassVisiable = false;
    },
    // 新建班级
    createClassOk() {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.$refs.createClassRuleForm as FormModel).validate((valid) => {
          if (valid) {
            const arr = [this.classQuery.teacherCodes];
            const queryList = {
              disable: this.classQuery.disable,
              name: this.classQuery.name,
              remarks: this.classQuery.remarks,
              teacherCodes: JSON.stringify(arr),
            };
            // console.log(queryList.teacherCodes);
            this.updateClassInfo(queryList)
              .then(async () => {
                this.createClassVisiable = false;
                (this.$refs.createClassRuleForm as FormModel).resetFields();
                this.queryClassLoading = true;
                await this.getClassInfo({
                  pageNo: this.classPageNo,
                  pageSize: 10,
                });
                this.queryClassLoading = false;
                message.success('创建成功');
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
    // 取消新建班级的回调
    createClassCancel() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.createClassRuleForm as FormModel).resetFields();
      this.classQuery.teacherCodes = '';
      this.createClassVisiable = false;
    },

    // 取消创建学生的回调
    createMemberCancel() {
      (this.$refs.createMemberRuleForm as FormModel).resetFields();
      this.createMemberQuery = {
        classId: '',
        userId: '',
        name: '',
      };
    },
    // 弹出新建班级框
    onCreateClass() {
      this.createClassVisiable = true;
      if (this.role !== 'admin') {
        this.classQuery.teacherCodes = this.code;
      }
    },
    // 学生明细创建新学生 弹出框
    onCreateMember() {
      this.createMemberVisiable = true;
    },
    // 表格项选择
    onSelectChange(selectedRowKeys: never[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 删除班级
    deleteClass(val: { id: string }) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '删除班级',
          content: '是否删除该班级？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            console.log(val);
            this.delCls({ ids: JSON.stringify([val.id]) }).then(async () => {
              const { res } = await this.getClassInfo({
                pageNo: 1,
                pageSize: 10,
              });
              console.log(res);
              resolve();
              console.log('OK');
            }).catch((err) => {
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

    deleteStu() {
      console.log(this.memberQuery);

      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: '删除用户',
          content: '是否删除该用户？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.delStuUser({ ids: JSON.stringify([this.memberQuery.userId]) }).then(async () => {
              const res = await this.getClassStudent({
                // eslint-disable-next-line @typescript-eslint/camelcase
                classRoom_uuid: this.selectedId,
                pageNo: this.memberPageNo,
                pageSize: 10,
              });
              console.log(res, 'page');
              this.memberPagination.total = res.totalRecords;
              resolve();
              console.log('OK');
            }).catch((err) => {
              reject(err);
            });
          },
          onCancel() {
            resolve();
          },
        });
      });
    },
    // 批量删除班级
    deleteClasses() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          message.info('请先选择要删除的班级');
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
              this.delCls({ ids: JSON.stringify(this.selectedRowKeys) }).then(async () => {
                const { res } = await this.getClassInfo({
                  pageNo: 1,
                  pageSize: 10,
                });
                console.log(res);
                this.selectedRowKeys = [];
                resolve();
                console.log('OK');
              }).catch((err) => {
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
  },
  computed: {
    ...mapGetters('ClassMemberController', ['studentList']),
    ...mapGetters('ClassController', ['classInfo']),
    ...mapGetters('UserController', ['role', 'teacherList', 'code', 'token']),
  },
});
</script>

<style lang="stylus" scoped>
>>>.ant-upload
  color #4a90e2
>>>.ant-btn-default
  color #40a9ff
  border-color #40a9ff
.btn-box
  display flex
  justify-content space-between
.btn-container
  display flex
  justify-content space-between
  width 326px
  a
    color #fff
.table-container
  margin-top 24px
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
      position relative
      cursor pointer
      color rgba(74, 144, 226, 1)
      .anticon
        font-size 16px
      span
        display inline-block
        cursor pointer
        height 18px
        line-height 18px
</style>
