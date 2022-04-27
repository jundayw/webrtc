//主要流程 ，其他方式传输 Description 和 Candidate
//呼叫方  createDataChannel->createOffer->获得和传输本身Description 和 Candidate ↓↓             -- >接收和设置对方传输Description 和 Candidate  -->OK          
//接听方                                  接收对方传输Description 和 Candidate  -->createAnswer --> 获得和传输本身Description 和 Candidate ↑↑   -->OK
var RTCPeerConnection = RTCPeerConnection || webkitRTCPeerConnection;
var pc;
var mediaConstraints = null;
var conf = null;
pc = new RTCPeerConnection(conf, mediaConstraints);
pc.onconnectionstatechange = function() {
    console.log(arguments);
};
pc.ondatachannel = function(e) {
    console.log("传输通道打开", arguments);
    channel = e.channel;
    channel.onopen = function() {
        tip("等待接收消息");
        console.log("接收通道打开", arguments);
    };
    channel.onclose = function() {
        tip("断开消息通道");
        console.log("接收通道关闭", arguments);
    };
    channel.onmessage = function(e) {
        console.log("接收通道信息", arguments);
        message("收到:" + e.data);
    };
};
pc.onicecandidate = function(e) {
    if (e.candidate) {
        //这里传输candidate给对方
        myCandidate.value = JSON.stringify(e.candidate);
    }
    console.log("获取ice", arguments);
};
pc.oniceconnectionstatechange = function() {
    console.log(arguments);
};
pc.onidentityresult = function() {
    console.log(arguments);
};
pc.onidpassertionerror = function() {
    console.log(arguments);
};
pc.onidpvalidationerror = function() {
    console.log(arguments);
};
pc.onnegotiationneeded = function() {
    console.log("需要协商", arguments);
    pc.createOffer().then(function(offer) {
        console.log("分配内容", offer);
        myDescription.value = JSON.stringify(offer);
        //这里传输Description 给接听方 , 手动复制
        tip("2.将 我的Description 和 Candidate复制到 接听方对应的 对方的Description 和 Candidate ,接听方点击接听");
        return pc.setLocalDescription(offer);
    });
};
pc.onpeeridentity = function() {
    console.log(arguments);
};
pc.onremovestream = function() {
    console.log(arguments);
};
pc.onsignalingstatechange = function() {
    console.log(arguments);
};
pc.ontrack = function() {
    console.log(arguments);
};
var channel;
//请求呼叫
callBtn.onclick = function() {
    channel = pc.createDataChannel("hehe", mediaConstraints); //可以发送文字什么的
    channel.onopen = function() {
        tip("可以发送消息");
        console.log("hehe通道打开", arguments);
    };
    channel.onclose = function() {
        tip("关闭消息通道");
        console.log("hehe通道关闭", arguments);
    };
    channel.onmessage = function(e) {
        console.log("hehe通道信息", arguments);
        message("收到:" + e.data);
    };
};
sendBtn.onclick = function() {
    channel.send(contentInput.value);
};
//接听输入的请求地址
answerBtn.onclick = function() {
    //这里获取传输过来的 Description ,手动粘贴
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(anDescription.value)));
    pc.createAnswer().then(function(ans) {
        console.log("分配内容", ans);
        myDescription.value = JSON.stringify(ans);
        //这里传输Description给呼叫方 , 手动复制
        tip("3.将 我的Description 和 Candidate复制到 呼叫方对应的 对方的Description 和 Candidate ,呼叫方点击确认");
        pc.setLocalDescription(ans);
    });
    pc.addIceCandidate(JSON.parse(anCandidate.value));
};
//请求呼叫方确认呼叫方的地址
anBtn.onclick = function() {
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(anDescription.value)));
    pc.addIceCandidate(JSON.parse(anCandidate.value));
};
//关闭
hangBtn.onclick = function() {
    channel.close();
    pc.close();
}