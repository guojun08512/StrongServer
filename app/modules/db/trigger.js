
// import sequelize from 'sequelize';

// 会员状态改变定时器
function memberStatusChange() {
  return true;
}

async function initTrigger() {
  memberStatusChange();
}

export { initTrigger };
