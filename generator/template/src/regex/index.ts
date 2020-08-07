const commonName = /^[\w\u4e00-\u9fa5]{2,20}/;
const commonName50 = /^[\w\u4e00-\u9fa5]{2,50}/;
const commonDoc = /\.(doc|docx|xls|xlsx|txt|ppt|pptx|pdf)$/g;
const Password = {
  regex: new RegExp(/^[\w_]{6,18}$/),
  errorMsg: '密码格式6-18位，包含字母或数字或下划线',
};
const ClassName = {
  regex: commonName,
  errorMsg: '班级名称长度为2-20个字符',
};
const Title = {
  regex: commonName50,
  errorMsg: '标题长度为2-50个字符',
};
const Doc = {
  regex: commonDoc,
  errorMsg: '文档格式错误',
};
export {
  Password, ClassName, Title, Doc,
};
