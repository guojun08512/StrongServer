需要先下载node环境
## 官网地址
```
test
http://nodejs.cn/
```
## 下载地址
```
http://nodejs.cn/download/
```
## 框架
```
koa2
```
## 使用说明
```
git clone xxx
cd xxx
npm i 
npm run start
```
## Docker 安装 Redis 并开启持久化
```
https://blog.csdn.net/diyiday/article/details/77619979
```
## 数据库 mysql 
```
依赖库
sequlize
```

## docker 安装路径
```
https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository
```

## docker-compose 安装

```
curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

# V1 Api
## version
```
request({
    uri: `${host}/version`,
    method: 'GET',
})

response ->
{
    body: {
        version,
        code,
        message,
        data,
    }
}
```
# 课程
```
## 增加
request({
    uri: `${host}/v1/course/add`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
    	//课名
		coursename,
		//种类
		coursekind, 
		//
		needConfine, 
		//停止约课
		stopOrderCourse, 
		//停止取消约课
		stopCancelCourse,
		// 时长
		coursetime,
		// 提前几天约课
		beforeDay,
		// 提前几天约课
		orderTime,
		// 最少
		mincoursemember
		// 最多/ 可约人数
		maxcoursemember,
		// 封面地址
		coverUrl,
		//备注
		remark,
		//是否需要通知取消
		notifyMsgStatus ,
		// 展示图片
		images,
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data: {
        	resStatus, //成功失败
        }
    }
}
## 更新
request({
    uri: `${host}/v1/course/:courseId/update`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
		课程表字段
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data: {
        	resStatus, //成功失败
        }
    }
}
## 删除
request({
    uri: `${host}/v1/course/delete`,
    method: 'DELETE',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
		courseIds:[
			courseId
		], //删除的uid
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data: {
        	resStatus, //成功失败
        }
    }
}
## 查找
request({
    uri: `${host}/v1/course`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
		pageCount, //每页个数
		curPage, //第几页
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data: {
            coursesInfo: {
                allCourse:[{
                    //课名
                    coursename,
                    //种类
                    coursekind, 
                    //
                    needConfine, 
                    //停止约课
                    stopOrderCourse, 
                    //停止取消约课
                    stopCancelCourse,
                    // 时长
                    coursetime,
                    // 提前几天约课
                    beforeDay,
                    // 提前几天约课
                    orderTime,
                    // 最少
                    mincoursemember
                    // 最多/可约人数
                    maxcoursemember,
                    // 封面地址
                    coverUrl,
                    //备注
                    remark,
                    //是否需要通知取消
                    notifyMsgStatus      ,
                    //展示图片
                    images,
                }], //课程内容
                courseCount,
            }
        }
    }
}


request({
    uri: `${host}/v1/queryCourseInfo`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
		courseId, // 课程uid
    }
})

response ->
{
    body: {
        version,
        code,
        message,
        data: { //课程内容
                    //课名
                    coursename,
                    //种类
                    coursekind, 
                    //
                    needConfine, 
                    //停止约课
                    stopOrderCourse, 
                    //停止取消约课
                    stopCancelCourse,
                    // 时长
                    coursetime,
                    // 提前几天约课
                    beforeDay,
                    // 提前几天约课
                    orderTime,
                    // 最少
                    mincoursemember
                    // 最多/可约人数
                    maxcoursemember,
                    // 封面地址
                    coverUrl,
                    //备注
                    remark,
                    //是否需要通知取消
                    notifyMsgStatus        		
               
            }
        }
    }
}

```

## 团课 
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/staff/course/grouplesson.js
```
## 团课预约 
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/staff/order/ordergroup.js
```
## 教练 / 私课预约/私课消课
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/staff/coach/coach.js
```
## 预约/体验
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/customer/guest/experience.js
```
## 员工 
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/staff/employeer/employee.js
```
## 权限 
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/staff/permission/permissionrole.js
```
## 首页 
```
https://www.evfit.cn/jung/nodeServer/blob/master/app/modules/routes/v1/homepage/homepage.js
```

# 会员数据录入
# 会员卡数据录入
# 签到
```
## 会员签到确认页面
request({
    uri: `${host}/v1/signin/memberConfirm`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
    	// 姓名/电话/实体卡号
		  param,
    }
})

## 会员签到
request({
    uri: `${host}/v1/signin/memberSignin`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
    	// 会员id
		  memberid,
      // 会员卡id
      vipcardid,
      // 签到人数
      number,
      // 签到方式
      sigin,
      // 手牌号
      RFID,
    }
})

## 会员签到取消
request({
    uri: `${host}/v1/signin/cancelMemSignin`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
    	// 签到表id
		  uid,
    }
})

## 查询签到列表
request({
    uri: `${host}/v1/signin/cancelMemSignin`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
    	// 姓名/电话/实体卡号
		  param,
      // 手牌号
      RFID,
      // 会员卡id
      vipcardid,
      // 开始时间
      starttime,
      // 结束时间
      endtime,
    }
})

## 全部签到列表
request({
    uri: `${host}/v1/signin/cancelMemSignin`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
    	// 页数量
      pageCount,
      // 第几页
      curPage,
    }
})

消课
v1/routes/coach.js
```
#购买会员卡
```
## 全部签到列表
request({
    uri: `${host}/v1/buyvipcard/memberBuyVipCard`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 会员id
      memberid,
      // 会员卡id
      vipcardid,
      // 教练
      coach,
      // 实体卡id
      entitycardid,
      // 购买天数，次数，节数，价值金额
      param1;
      // 赠送
      param2;
      // 有效期
      validity;
      // 开卡类型
      opencardtype;
      // 开卡时间
      opencardtime;
      // 到期时间
      expirytime;
      // 售价
      price; 
      // 折扣卷
      volume; 
      // 合同金额
      contractamount; 
      // 支付方式
      payment; 
      // 业绩归属
      ascription;
      // 成交时间 
      transactiontime; 
      // 成交方式
      transaction; 
      // 备注
      remark; 
    }
})

```
#管理数据，管理员，场馆，教室
```
## 注册管理员
request({
    uri: `${host}/v1/manage/registerAdmin`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 用户名
      username; 
      // 密码
      password; 
      // 电话号
      cellphone; 
      // 姓名
      name; 
      // 身份证号
      card; 
      // 有效期
      expirydate; 
    }
})
## 更新管理员
request({
    uri: `${host}/v1/manage/UpdateAdmin`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 管理员id
      uid;
      // 用户名
      username; 
      // 密码
      password; 
      // 电话号
      cellphone; 
      // 姓名
      name; 
      // 身份证号
      card; 
      // 有效期
      expirydate; 
    }
})
## 增加场馆
request({
    uri: `${host}/v1/manage/AddStore`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 场馆名称
      storename; 
      // 场馆地址
      storeaddr; 
      // 场馆电话
      storephone; 
      // 场馆介绍内容
      introduction; 
      // 场馆图片
      pictures; 
    }
})
## 更新场馆
request({
    uri: `${host}/v1/manage/UpdateStore`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 场馆id
      uid;
      // 场馆名称
      storename; 
      // 场馆地址
      storeaddr; 
      // 场馆电话
      storephone; 
      // 场馆介绍内容
      introduction; 
      // 场馆图片
      pictures; 
    }
})
## 增加教室
request({
    uri: `${host}/v1/manage/AddClass`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 场馆id
      storeid; 
      // 教室名字
      classname; 
      // 教室可容纳人数
      number; 
    }
})
## 更新教室
request({
    uri: `${host}/v1/manage/AddClass`,
    method: 'POST',
    headers: {
    	Authorization: `Bearer ${token}`
    }
    body: {
      // 教室id
      uid; 
      // 教室名字
      classname; 
      // 教室可容纳人数
      number; 
    }
})
```

##  2019/03/30 提交
## 增加会员卡
request({
    uri: `${host}/v1/vipcard/addVipCard`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          cardtype; // 类型						int
		  cardsubtype; // 子类型				int
		  cardname; // 会员卡名称				str
          validity; // 有效期					int
          price; // 售价						float
          onsale; // 在售状态					str
          purchase; // 会员手机端是否可以购买	int			0 否  1 是
          remark; // 描述						str	
          param; // 次数/金额					int
          recommendWeight; // 推荐权重			int
		  images; // 展示图片					str
    }
})

1, // 单店卡
2, // 多店卡
3, // 体验卡

1, // 期限卡
2, // 次卡
3, // 储值卡

## 更新会员卡
request({
    uri: `${host}/v1/vipcard/updateVipCard`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          uid; // 会员卡id
		  cardname; // 会员卡名称
    }
})

## 更新会员卡
request({
    uri: `${host}/v1/vipcard/deleteVipCard`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          uids; // 会员卡id		数组
    }
})

## 查询会员卡
request({
    uri: `${host}/v1/vipcard/queryVipCardDetails`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          uid; // 会员卡id
    }
})


## 增加私教课
request({
    uri: `${host}/v1/vipcard/addPrivate`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
		privatename; // 会员卡名称				str
		validity; // 有效期						int
		param; // 节数							int
		data.price; // 售价						float
		onsale; // 在售状态						str
		purchase; // 会员手机端是否可以购买		int
		remark; // 描述							str
		recommendWeight; // 推荐权重			int
		images; // 展示图片						str
    }
})

## 更新私教课
request({
    uri: `${host}/v1/vipcard/updatePrivate`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          uid; // 会员卡id
		  cardname; // 会员卡名称
    }
})

## 更新私教课
request({
    uri: `${host}/v1/vipcard/deletePrivate`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          uids; // 会员卡id		数组
    }
})

## 查询私教课
request({
    uri: `${host}/v1/vipcard/queryPrivateDetails`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
          uid; // 会员卡id
    }
})

## 增加会员
request({
    uri: `${host}/v1/mmebers/registerMember`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
        username; // 姓名		 str
		sex; // 性别		     int
		cellphone; // 电话		 str
		idcard; // 身份证号码	 str
		birthday; // 生日		 str
		from; // 获客来源		 str
		belong; // 会籍归属		 str
		tags; // 用户标签		 str
		city; // 所在城市		 str
		remark; // 备注			 str
    }
})

## 购买会员卡
request({
    uri: `${host}/v1/mmebers/MemberBuyVipCard`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
        memberid; // 会员id
		vipcardid; // 会员卡id
		entitycardid; // 实体卡号		str
		opencardtime; // 开卡时间		str
		volume; // 折扣卷				float
		payment; // 支付方式			int
		ascription; // 业绩归属			str
		transaction; // 成交方式		str
		remark; // 备注					str
		give; // 赠送					int
    }
})

1, // 现金
2, // 微信
3, // 支付宝
4, // 刷卡
5, // 其他

## 购买私教课
request({
    uri: `${host}/v1/mmebers/MemberBuyVipCard`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
    }
    body: {
        data.memberid; // 会员id
		data.privateid; // 私教课id
		data.entitycardid; // 实体卡号
		opencardtime; // 开卡时间
		volume; // 折扣卷
		payment; // 支付方式
		ascription; // 业绩归属
		transaction; // 成交方式
		remark; // 备注
		give; // 赠送
		coachid; // 教练			str
    }
})

[返回顶部](#v2-api)