/**
 * @authors Your Name (you@example.org)
 * @date    2018-02-10 11:03:01
 * @version $Id$
 */
 window.onload = function(){
 	var musicMenu = getClass("song_sheet")[0];//歌单
	var oMenu = getClass("menu")[0]; //歌单列表
	// var aMenu_sname = oMenu.getElementsByTagName("span"); //歌单歌名
	// var aMenu_remove = oMenu.getElementsByTagName("i"); //歌单删除键
	var oSearch = getClass("search_iput")[0]; //搜索框
	var aSearch_list = getClass("search_list")[0];//搜索显示歌曲列表
	var oHistory_btn = getClass("his_btn")[0];//历史纪录按钮
	var oHis_menu = getClass("his_menu")[0];//历史纪录歌单
	var oSname = getClass("title")[0];//正在播放的歌名
	var oSinger = getClass("singer")[0];//正在播放歌曲演唱者
	var oPic = getClass("pic")[0]; //转到图片
	var oAlbum = getClass("album")[0];//专辑
	var oLyc_list = getClass("lyc_list")[0];//歌词列表
	var oCanv = document.querySelector("canvas");//canvas音频图
	var oCurTime = getClass("curTime")[0];//歌曲当前时间
	var oProgress_bar = getClass("progress_bar")[0];//总进度条
	var oProgress = getClass("progress")[0];//当前进度
	var oAllTime = getClass("allTime")[0];//歌曲总时间
	var oPattern = getClass("pattern")[0];//播放模式
	var oLoad = getClass("load")[0];//加载动画
	var oPrev = getClass("prev")[0];//前一首
	var oPlay = getClass("play")[0];//播放
	var oNext = getClass("next")[0];//下一首
	var oVolume = getClass("volume")[0];//音量
	var vRange = getClass("range")[0];
	var oAudio = getClass("audio")[0];//播放器
	var value = "说散就散";//搜索框值
	var inSearch = false;//搜索框开关
	var menu_onOff = true;//歌单开关
	var his_onOff = true;//历史记录开关
	var play_onOff = true;//播放开关
	var vom_onOff = true;
	var aMenu_sname;//歌单歌名
	var aMenu_remove;//歌单删除键
	var id = 0;//歌曲id
	var n = 0;//播放顺序变量
	var m = 0;//歌词上移变量
	var rotTimer;//专辑转动定时器
	//禁止选中
	document.onselectstart = function(){
		return false;
	}
	//禁止拖拽
	document.ondrag = function(){
		return false;
	}
	//requestAnimationFrame兼容
	window.requestAnimationFrame = window.requestAnimationFrame || function (fn){
		return setTimeout(fn,1000/60);
	};
	window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
	//创建歌单
	createMenu();
	function createMenu(){
		var str = '';
		for(var i=0,length=lrc.length;i<length;i++){
			str += '<p><span>'+lrc[i].songName+'</span><i>删除</i></p>';
		}
		oMenu.innerHTML = str;
		aMenu_sname = oMenu.getElementsByTagName("span"); //歌单歌名
		aMenu_remove = oMenu.getElementsByTagName("i"); //歌单删除键
	}
	//阻止滚动冒泡
	oMenu.touchmove = function(e){
		e.stopPropagation();
	}
	oHis_menu.touchmove = function(e){
		e.stopPropagation();
	}
	aSearch_list.touchmove = function(e){
		e.stopPropagation();
	}
	//得到当前默认播放歌曲
	getMusic();
	//得到当前默认播放歌词
	getLyric();
	function getMusic(){
		oSname.innerHTML = lrc[n].songName;
		oSinger.innerHTML = lrc[n].singer;
		oAlbum.style.background = 'url("'+lrc[n].album+'") no-repeat center center';
		oAlbum.style.backgroundSize = "130px 130px";
		oAudio.src = lrc[n].src;
	}
	//点击播放歌曲
	oPlay.onclick = function(){
		onOff();
		getLyric();
		playMusic();
	}
	//上一首
	oPrev.onclick = function(){
		if(aMenu_sname.length){//歌单里面有歌才能上一首
			m = 0; //歌词滚动位置清零
			cancelAnimationFrame(rotTimer);//清除动画
			var aListMenu = oMenu.getElementsByTagName("p");
			oLyc_list.style.top = "0px";//歌词列表top置0
			var length = aListMenu.length;
			n--;
			if(n<0){
				n = length -1;
			}
			play_onOff = true;
			getMusic();//得到当前歌曲
			getLyric();//得到当前歌词
			onOff();
			history();//将播放过的存入历史纪录
			playMusic();//播放歌曲
		}
	}
	//下一首
	oNext.onclick = function(){
		if(aMenu_sname.length){//歌单里面有歌才能下一首
			m = 0; //歌词滚动位置清零
			cancelAnimationFrame(rotTimer);//清除动画
			var aListMenu = oMenu.getElementsByTagName("p");
			oLyc_list.style.top = "0px";//歌词列表top置0
			var length = aListMenu.length;
			n++;
			n %= length;
			play_onOff = true; 
			getMusic();//得到当前歌曲
			getLyric();
			onOff();
			history();//将播放过的存入历史纪录
			playMusic();//播放歌曲
		}
	}

	//扬声器按钮
	oVolume.onclick = function(e){
		e.stopPropagation();
		if(vom_onOff){
			oMenu.style.display = "none";
			oHis_menu.style.display = "none";
			aSearch_list.style.display = "none";
			vRange.style.display = "block";
			menu_onOff = true;
			his_onOff = true;
			inSearch = false;
		}else{
			vRange.style.display = "none";
		}
		vom_onOff = !vom_onOff;
	}
	//加减音量
	vRange.onchange = function(){
		oAudio.volume = this.value*0.1;
	}
	//播放模式切换
	var rand = 3;
	oPattern.onclick = function(){
		rand++;
		rand %= 4;
		oPattern.style.background = 'url("images/rand'+rand+'.png") no-repeat center center';
	}
	//四个开关的控制
	function onOff(){
		oMenu.style.display = "none";
		oHis_menu.style.display = "none";
		aSearch_list.style.display = "none";
		vRange.style.display = "none";
		menu_onOff = true;
		his_onOff = true;
		inSearch = false;
		vom_onOff = true;
	}
	//点击文档隐藏列表
	document.onclick = function(){
		onOff();
	}
	//播放模式
	loop();
	function loop(){
		oAudio.addEventListener("ended",function(){
			history();//将播放过的存入历史纪录
			switch(rand){//以rand为判断标准
				case 0://播放一首
					m=0;
					cancelAnimationFrame(rotTimer);
					oPlay.style.background = 'url("images/play.png") no-repeat center center';
					oLyc_list.style.top = "0px";//歌词列表top置0
					play_onOff = true;
					menu_onOff = true;
					his_onOff = true;
					inSearch = false;
					break;
				case 1:// 单曲循环播放
					m = 0;
					loop_switch();
					break;
				case 2:// 全部歌曲循环播放
					if(aMenu_sname.length){//歌单中有歌曲 顺序循环
						m = 0;
						var aListMenu = oMenu.getElementsByTagName("p");
						oLyc_list.style.top = "0px";//歌词列表top置0
						var length = aListMenu.length;
						n++;
						n %= length;
						loop_switch();
					}else{//歌单无歌 则单曲循环
						m = 0;
						loop_switch();
					}
					break;
				case 3://随机播放
					if(aMenu_sname.length){//歌单中有歌曲 随机播放顺序循环
						m = 0;
						var len = oMenu.getElementsByTagName("p").length;
						n = Math.floor(Math.random()*len);
						loop_switch();
					}else{//歌单中有歌曲 单曲循环
						m = 0;
						loop_switch();
					}
					break;
			}
		},false);
	}
	//播放模式播放歌曲
	function loop_switch(){
		cancelAnimationFrame(rotTimer);//清除动画
		oLyc_list.style.top = "0px";
		play_onOff = true;
		menu_onOff = true;
		his_onOff = true;
		inSearch = false;
		getMusic();//得到当前歌曲
		getLyric();//得到歌词
		playMusic();//播放歌曲
	}
	//专辑旋转
	var k = 0;//旋转角度变量
	function rotate(){
		k += 0.5;
		k %= 360;
		oPic.style.transform = "rotate("+k+"deg)";
		rotTimer = requestAnimationFrame(rotate); 
	}
	//播放音乐
	function playMusic(){
		if(play_onOff){
			oAudio.play();
			rotate();
			oPlay.style.background = 'url("images/pause.png") no-repeat center center';
			play_onOff = false;
			creatAudioMap();//创建音频图
		}else{
			oAudio.pause();
			cancelAnimationFrame(rotTimer);//清除动画
			oPlay.style.background = 'url("images/play.png") no-repeat center center';
			play_onOff = true;
		}
	}
	//歌单列表
	musicMenu.onclick = function(e){
		e.stopPropagation();
		if(menu_onOff){
			var aI = oMenu.getElementsByTagName("i");
			if(!aI.length){
				oMenu.style.display = "none";
			}else{
				oMenu.style.display = "block";
				oHis_menu.style.display = "none";
				aSearch_list.style.display = "none";
				vRange.style.display = "none";//音量条
				his_onOff = true;
				inSearch = false;
				vom_onOff = true;
				var aSongList = oMenu.getElementsByTagName("span");
				for(var i=0,length=aSongList.length;i<length;i++ ){
					aSongList[i].index = i;
					aSongList[i].onclick = function(){
						cancelAnimationFrame(rotTimer);//清除动画
						m = 0; //歌词滚动位置清零
						oLyc_list.style.top = "0px";//歌词列表top置0
						oMenu.style.display = "none";
						menu_onOff = true;
						play_onOff = true;
						n = this.index;
						getMusic();
						getLyric();
						history();//将播放过的存入历史纪录
						playMusic();
					}
				}
				var aI = oMenu.getElementsByTagName("i");
				for(var i=0,length=aI.length;i<length;i++){
					aI[i].index = i;
					aI[i].onclick = function(e){
						e.stopPropagation();
						this.parentNode.parentNode.removeChild(this.parentNode);
						//重新记录索引
						for(var j=0,length=aI.length;j<length;j++){
							aI[j].index = j;
						}
						if(!aI.length){
							oMenu.style.display = "none";
							menu_onOff = true;
						}
					}
				}
			}
		}else{
			oMenu.style.display = "none";
		}
		menu_onOff = !menu_onOff;
	}

	//历史纪录列表
	oHistory_btn.onclick = function(e){
		e.stopPropagation();
		oMenu.style.display = "none";
		aSearch_list.style.display = "none";//搜索列表消失
		vRange.style.display = "none";//音量条
		menu_onOff = true;
		inSearch = false;
		vom_onOff = true;
		var aP = oHis_menu.getElementsByTagName("p");
		if(aP.length){
			var aSong = oHis_menu.getElementsByTagName("span");
			var det = oHis_menu.getElementsByTagName("i");
			//删除历史记录
			for(var i=0,length=det.length;i<length;i++){
				det[i].index = i;
				det[i].onclick = function(e){
					e.stopPropagation();
					det[this.index].parentNode.parentNode.removeChild(det[this.index].parentNode);
					//重新记录索引
					for(var i=0,length=det.length;i<length;i++){
						det[i].index = i;
					}
					//有记录显示列表，没有则消失oHis_menu
					if(!det.length){
						oHis_menu.style.display = "none";
						his_onOff = true;
					}
				}
			}
			if(his_onOff){
				oHis_menu.style.display = "block";
			}else{
				oHis_menu.style.display = "none";
			}
			his_onOff = !his_onOff;
		}
	}
	//加入历史纪录
	function history(){
		var str = '';
		var aSpan = oHis_menu.getElementsByTagName("span");
		if(aMenu_sname[n]){
			str = '<p><span>'+aMenu_sname[n].innerHTML+'</span><i>删除</i></p>';
			oHis_menu.innerHTML += str;
		}
	}
	//搜索框焦点,列表消失
	oSearch.onfocus = function(){
		onOff();//各列表消失
	}
	//点击搜索
	document.onkeydown = function(e){
		e = e || window.event;
		if(e.keyCode==13){
			if(oSearch.value){
				inSearch = true;
				value = oSearch.value;
				createMusic();
			}
		}
		if(!oSearch.value){
			aSearch_list.style.display = "none";
		}
	}
	//处理歌曲  由于版权限制，接口不能调用了
	function getmusic(data){
		if(inSearch){
			var str = '';
			var m_Data = data.showapi_res_body.pagebean.contentlist;
			if(m_Data.length){
				aSearch_list.style.display = 'block';
				for(var i=0,length=m_Data.length;i<length;i++){
					str += '<li><span>'+m_Data[i].songname+'</span><i>'+m_Data[i].singername+'</i></li>';
				}
				aSearch_list.innerHTML = str;
				var aLi = aSearch_list.getElementsByTagName("li");
				for(var i=0,length=aLi.length;i<length;i++){
					aLi[i].index = i;
					aLi[i].onclick = function(){//console.log(this.index);
						//oSname.innerHTML = m_Data[this.index].songname;
						//oSinger.innerHTML = m_Data[this.index].singername;
						//id = m_Data[this.index].songid;
						//oAudio.src = m_Data[this.index].m4a;
						//playMusic();
						alert("很抱歉,由于版权限制,所有歌曲都不能播放!");
						aSearch_list.style.display = "none";
						oSearch.value = '';
					}
				}
			}
		}
	}
	//处理歌词
	function getLyric(){
		var lyric = lrc[n].lyric;
		var a = lyric.split('[');
		var str = '';
		for(var i=0,length=a.length;i<length;i++){
			var b = a[i].split(']');
			var c = b[0].split('.');
			var d = c[0].split(':');
			var s = d[0]*60 + d[1]*1;//把01分钟转换成数字 "28"字符串转换成数字
			var e = b[1];//歌词
			//console.log(e);
			if(e){//因为第一句为undefind 所以要从第二句开始
				str += "<p id="+s+">"+e+"</p>"//id名为当前秒数
			}
		}
		oLyc_list.innerHTML = str;//歌词放入列表
		//歌曲播放时监听时间 词曲进度同步
		oAudio.addEventListener('timeupdate',function(){
			var aP = oLyc_list.getElementsByTagName("p");//所有歌词
			var curTime = parseInt(this.currentTime);//歌曲当前时间
			oCurTime.innerHTML = time(curTime);//时间进度
			oAllTime.innerHTML = time(oAudio.duration);//总时间
			var scale = curTime/oAudio.duration;//时间比例
			oProgress.style.width = scale*(oProgress_bar.offsetWidth - 8) + 'px';//进度
			if(aP[m+4]&&aP[m+4].id == curTime){
				oLyc_list.style.top = -m*25 + "px";
				m++;
			}
			if(document.getElementById(curTime)){
				for(var i=0,length=aP.length;i<length;i++){
					aP[i].style.cssText = 'color:#ccc';//给每句歌词设置样式
				}
				//给当前演唱歌词设置样式
				document.getElementById(curTime).style.cssText = 'color:#F26E6F;font-size:16px';
			}
		},false);
	}
	//创建音频图
	//creatAudioMap();//创建音频图
	function creatAudioMap(){
	    	var oCanv = document.querySelector("canvas");
	    	var oAudio = getClass("audio")[0];
	    	var cxt = oCanv.getContext("2d");
	    	var w = 375;
	    	var h = 200;
	    	oCanv.width = w;
	    	oCanv.height = h;
	    	//兼容
	    	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	    	//创建音频对象
	    	var aContext = new AudioContext();
	    	//创建音频节点
	    	var aSource = aContext.createMediaElementSource(oAudio);
	    	//创建分析对象
	    	var analyser = aContext.createAnalyser();
	    	//3. 处理音频   source -> analyser -> 耳机
	    	aSource.connect(analyser);
	    	analyser.connect(aContext.destination);
	    	//创建8位无符号整形数组  缓冲区
	    	var arr = new Uint8Array(analyser.frequencyBinCount);
	    	//渐变颜色
	    	var color = cxt.createLinearGradient(w/2,h/2-100,w/2,h/2+100);
	    	color.addColorStop(0,"rgba(255,0,0,0.5)");
	    	color.addColorStop(0.5,"rgba(0,255,0,0.5)");
	    	color.addColorStop(1,"rgba(0,0,255,0.5)");
	    	var count = 50;
	    	(function draw(){
	    		cxt.clearRect(0,0,w,h);
	    		analyser.getByteFrequencyData(arr);
	    		//间隔
	    		var step = Math.round(arr.length/count);
	    		//console.log(arr);
	    		cxt.beginPath();
	    		for(var i=0;i<count;i++){
	    			var hight = Math.floor(arr[step*i]/2);
	    			cxt.fillStyle = color;
	    			//上面
	    			cxt.fillRect(i*10+w/2,h/2,4,-hight);
	    			cxt.fillRect(w/2-(i-1)*10,h/2,4,-hight);
	    			//下面
	    			cxt.fillRect(i*10+w/2,h/2,4,hight);
	    			cxt.fillRect(w/2-(i-1)*10,h/2,4,hight);
	    		}
	    		cxt.closePath();
	    		requestAnimationFrame(draw);
	    	})()
	}
	//时间转换
	function time(cTime){
		cTime = parseInt(cTime);
		var h = toTwo(Math.floor(cTime%3600));  //获取 小时所剩的秒数
		var m = toTwo(Math.floor(cTime/60)); // 获取分
		var s = toTwo(Math.floor(cTime%60));  // 获取秒
		return m+":"+s;
	}
	function toTwo(time){
		return time>=10?time:"0"+time;
	}

	//load加载
	//function load(){
		// oAudio.addEventListener("canplay",function(){
		// 	setTimeout(function(){
		// 		oAudio.play();
		// 		play_onOff = true;
		// 		rotate();
		// 		oLoad.style.display = "none";
		// 	},100);
		// },false);
	//}

	//请求歌曲
	function createMusic(){
		$.ajax({
		    type: 'post',
		    url: 'http://route.showapi.com/213-1',
		    dataType: 'json',
		    data: {
		        "showapi_timestamp": formatterDateTime(),
		        "showapi_appid": 54364, //这里需要改成自己的appid
		        "showapi_sign": 'dda7ef0e36fc434b9822f09ca283a393',  //这里需要改成自己的应用的密钥secret
		        "keyword":value,
		        "page":"1"
		    },
		    error: function(XmlHttpRequest, textStatus, errorThrown) {
		        alert("操作失败!");
		    },
		    success: function(result) {
		        //createMusic(result) //console变量在ie低版本下不能用
		        getmusic(result);
		    }
		});
	}

	//请求歌词
	// function createLyric(){
	// 	$.ajax({
	// 	    type: 'post',
	// 	    url: 'http://route.showapi.com/213-2',
	// 	    //dataType: 'json',
	// 	    data: {
	// 	        "showapi_timestamp": formatterDateTime(),
	// 	        "showapi_appid": 54364, //这里需要改成自己的appid
	// 	        "showapi_sign": 'dda7ef0e36fc434b9822f09ca283a393',  //这里需要改成自己的应用的密钥secret
	// 	        "musicid":"4833285"

	// 	    },

	// 	    error: function(XmlHttpRequest, textStatus, errorThrown) {
	// 	        alert("操作失败!");
	// 	    },
	// 	    success: function(result) {
	// 	        //console.log(result) //console变量在ie低版本下不能用
	// 	        getLyric(result);

	// 	    }
	// 	});
	// }

	//获取当前时间
	function formatterDateTime() {
		var date=new Date()
		var month=date.getMonth() + 1
		var datetime = date.getFullYear()
	        + ""// "年"
	        + (month >= 10 ? month : "0"+ month)
	        + ""// "月"
	        + (date.getDate() < 10 ? "0" + date.getDate() : date
	                .getDate())
	        + ""
	        + (date.getHours() < 10 ? "0" + date.getHours() : date
	                .getHours())
	        + ""
	        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
	                .getMinutes())
	        + ""
	        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
	                .getSeconds());
		return datetime;
	}

	//获取类名
	function getClass(cName){
		if(window.getElementsByClassName){
			return document.getElementsByClassName("cName");
		}else{
			var arr = [];
			var all = document.getElementsByTagName("*");
			for(var i=0;i<all.length;i++){
				if(cName==all[i].className){
					arr.push(all[i]);
				}
			}
			return arr;
		}
	}
}

