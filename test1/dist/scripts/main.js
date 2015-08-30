/**
 * Created by Alkali on 15/8/7.
 */
var MyQuery = {
    addHandler: function (oElement, sEvent, fnHandler) {
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler)
    },
    removeHandler: function (oElement, sEvent, fnHandler) {
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler)
    },
    addLoadHandler: function (fnHandler) {
        this.addHandler(window, "load", fnHandler)
    },
    hasClass: function (obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function (element, value) {
        if(!element.className){
            element.className = value;
        }else{
            var newClassName = element.className;
            newClassName += " " + value;
            element.className = newClassName;
        }
    },
    removeClass: function (obj, cls) {
        if (MyQuery.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },
    getTagList: function (element, tag) {
        if(!tag) return element.children;
        var list = element.children,
            tagList = [];
        for(var i = 0, len = list.length; i < len; i ++) {
            if(list[i].tagName.toLowerCase() == tag.toLowerCase()) {
                tagList.push(list[i]);
            }
        }
        return tagList;
    },
    getObjStyle: function(obj, style) {
        if(obj.currentStyle)
            return obj.currentStyle[style];
        else if(window.getComputedStyle)
            return window.getComputedStyle(obj, null)[style];
        else
            return null;
    },
    getClassName: function(className){
        var el = [],
            _el = document.getElementsByTagName('*');
        for(var i=0; i<_el.length; i++){
            if (MyQuery.hasClass(_el[i], className)){
                el[el.length] = _el[i];
            }
        }
        return el;
    },
    setStyle: function(el, strCss, callback){
        var sty = "";
        var s;
        for (s in strCss) {
            sty += s + ":" + strCss[s] + ";";
        }
        el.style.cssText += ";" + sty;
        if(callback && typeof callback === "function") callback();
    },
    insertAfter: function(newElement,targetElement){
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement){
            parent.appendChild(newElement);
        }else{
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    },
    //给某一类名元素的下一兄弟元素添加class名
    //比如给每一个h1元素的下一兄弟元素都加上一个相同的class
    //需要用addClass函数
    styleElementSiblings: function(tag,theclass){
        if(!document.getElementsByTagName) return false;
        var elems = document.getElementsByTagName(tag);
        var elem;
        for(var i = 0;i < elems.length;i++){
            elem = getNextElement(elem[i].nextSibling);
            MyQuery.addClass(elem,theclass);
        }
    },
    rand: function(min, max){
        return Math.round(min + (Math.random() * (max - min)));
    },
    fade: function(element, transparency, speed, callback){//透明度渐变：transparency:透明度 0(全透)-100(不透)；speed:速度1-100，默认为1
        if(typeof(element) == "string") element = document.querySelector("#" + element);
        if(!element.effect){
            element.effect = {};
            element.effect.fade = 0;
        }
        clearInterval(element.effect.fade);
        var speed = speed || 1;
        var start = (function(elem){
            var alpha;
            if(navigator.userAgent.toLowerCase().indexOf("msie") != -1){
                alpha = elem.currentStyle.filter.indexOf("opacity=") >= 0 ? (parseFloat(elem.currentStyle.filter.match(/opacity=([^)]*)/)[1] )) + '': '100';
            }else{
                alpha = 100 * elem.ownerDocument.defaultView.getComputedStyle(elem, null)["opacity"];
            }
            return alpha;
        })(element);
        element.effect.fade = setInterval(function(){
            start = start < transparency ? Math.min(start + speed, transparency) : Math.max(start - speed, transparency);
            element.style.opacity = start / 100;
            element.style.filter = "alpha(opacity=" + start + ")";
            if(Math.round(start) == transparency){
                element.style.opacity = transparency / 100;
                element.style.filter = "alpha(opacity=" + transparency + ")";
                clearInterval(element.effect.fade);
                if(callback) callback.call(element);
            }
        }, 20);
    },
    move: function(element, position, speed, callback){//移动到指定位置，position:移动到指定left及top 格式{left:120, top:340}或{left:120}或{top:340}；speed:速度 1-100，默认为10
        if(typeof(element) == "string") element = document.querySelector("#" + element);
        if(!element.effect){
            element.effct = {};
            element.effect.move = 0;
        }
        clearInterval(element.effect.move);
        var speed = speed || 10;
        var start = (function(elem){
            var posi = {left: elem.offsetLeft, top:elem.offsetTop};
            while(elem = elem.offsetLeft){
                posi.left += elem.offsetLeft;
                posi.top += elem.offsetTop;
            };
            return posi;
        })(element);
        element.style.position = "absolute";
        var style = element.style;
        var styleArr = [];
        if(typeof(position.left) == "number") styleArr.push("left");
        if(typeof(position.top) == "number") styleArr.push("top");
        element.effect.move = setInterval(function(){
            for(var i = 0; i < styleArr.length; i++){
                start[styleArr[i]] += (position[styleArr[i]] - start[styleArr[i]]) * speed / 100;
                style[styleArr[i]] = start[styleArr[i]] + "px";
            }
            for(var i = 0; i < styleArr.length; i++){
                if(Math.round(start[styleArr[i]]) == position[styleArr[i]]){
                    if(i != styleArr.length - 1) continue;
                }else{
                    break;
                }
                for(var i = 0; i < styleArr.length; i++){
                    style[styleArr[i]] = position[styleArr[i]] + "px";
                }
                clearInterval(element.effect.move);
                if(callback) callback.call(element);
            }
        }, 20)
    },
    resize: function(element, size, speed, callback){//长宽渐变：size:要改变到的尺寸 格式 {width:400, height:250}或{width:400}或{height:250}；speed:速度 1-100，默认为10
        if(typeof(element) == "string") element = document.getElementById(element);
        if(!element.effect){
            element.effect = {};
            element.effect.resize = 0;
        }
        clearInterval(element.effect.resize);
        var speed = speed || 10;
        var	start = {width: element.offsetWidth, height: element.offsetHeight};
        var styleArr = [];
        if(!(navigator.userAgent.toLowerCase().indexOf('msie') != -1 && document.compatMode == 'BackCompat')){
            //除了ie下border-content式盒模型情况外，需要对size加以修正
            var CStyle = document.defaultView ? document.defaultView.getComputedStyle(element,null) : element.currentStyle;
            if(typeof(size.width) == 'number'){
                styleArr.push('width');
                size.width = size.width - CStyle.paddingLeft.replace(/\D/g,'') - CStyle.paddingRight.replace(/\D/g,'');
            }
            if(typeof(size.height) == 'number'){
                styleArr.push('height');
                size.height = size.height - CStyle.paddingTop.replace(/\D/g,'') - CStyle.paddingBottom.replace(/\D/g,'');
            }
        }
        element.style.overflow = 'hidden';
        var	style = element.style;
        element.effect.resize = setInterval(function(){
            for(var i = 0; i < styleArr.length; i++){
                start[styleArr[i]] += (size[styleArr[i]] - start[styleArr[i]]) * speed / 100;
                style[styleArr[i]] = start[styleArr[i]] + 'px';
            }
            for(var i = 0; i < styleArr.length; i++){
                if(Math.round(start[styleArr[i]]) == size[styleArr[i]]){
                    if(i != styleArr.length - 1)continue;
                }else{
                    break;
                }
                for(var i = 0; i < styleArr.length; i++)style[styleArr[i]] = size[styleArr[i]] + 'px';
                clearInterval(element.effect.resize);
                if(callback)callback.call(element);
            }
        }, 20);
    },
    createXMLHTTPRequest: function(){
        var xmlHttpRequest;
        if(window.XMLHttpRequest){
            xmlHttpRequest = new XMLHttpRequest();
        }else if(window.ActiveXObject){
            var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
            for ( var i = 0; i < activexName.length; i++) {
                try {
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if(xmlHttpRequest){
                        break;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
        return xmlHttpRequest;
    },
    get: function(url, callback){
        var xhr = MyQuery.createXMLHTTPRequest();
        if(xhr){
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        if(callback && typeof callback === "function") callback();
                    }else{
                        alert("error");
                    }
                }
            }
            xhr.send(null);
        }
    },
    post: function(url, callback, data){
        var xhr = MyQuery.createXMLHTTPRequest();
        if(xhr){
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            if(data && typeof data === "string"){
                xhr.send(data);
            }else{
                xhr.send(null);
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        if(callback && typeof callback === "function") callback(xhr);
                    }else{
                        alert("error");
                    }
                }
            }
        }
    }
};
;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));
/**
 * Created by Alkali on 15/8/30.
 */
;(function(){
    var body = document.querySelector("body"),
        footer = document.querySelector("footer"),
        panel = document.querySelector("#panel");
        url = "http://kaohe.zeroling.com/kaohe/list";
    var start = 0,
        len = 3,
        iSure = true,
        once = true;
    var sendData = "start=" + start + "&len=" + len;
    getData();
    window.onscroll = function(){
        var totalHeigh = document.body.offsetHeight,
            scrollTop = document.body.scrollTop,
            height = document.documentElement.clientHeight;

        if(scrollTop / (totalHeigh - height) >= 0.95 && once){
            footer.style.display = "block";
            getData();
        }
    }
    function appendList(data){
        var footer = document.querySelector("footer");
        if(data.length == 0 && once === true){
            once = false;
            panel.style.display = "block";
            setTimeout(function(){
                MyQuery.fade(panel,0, 50);
            },2000);
        }
        for(var i in data){
            var section = document.createElement("section"),
                list = document.createElement("div"),
                listPreview = document.createElement("img"),
                listInfo = document.createElement("div"),
                infoLeft = document.createElement("div"),
                h2 = document.createElement("h2"),
                h3 = document.createElement("h3"),
                star = document.createElement("div"),
                average = document.createElement("span"),
                infoLeftBottom = document.createElement("div"),
                distance = document.createElement("span"),
                infoRight = document.createElement("div"),
                p = document.createElement("p"),
                big = document.createElement("big"),
                ul = document.createElement("ul");
            MyQuery.addClass(section, "list-wrap");
            MyQuery.addClass(list, "list");
            MyQuery.addClass(star, "star");
            MyQuery.addClass(listPreview, "list-img");
            listPreview.src = data[i].imgUrl;
            MyQuery.addClass(listInfo, "list-info");
            MyQuery.addClass(listInfo, "claerfix");
            MyQuery.addClass(infoLeft, "info-left");

            h2.innerHTML = data[i].title;


            //添加星星
            var stars = data[i].stars,
                num = parseInt(stars.split("."[0]));
            if(stars == "0"){
                for(var a = 0; a < 5; a++){
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe602;";
                    MyQuery.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
            }else if(stars == "5"){
                for(var a = 0; a < 5; a++){
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe600;";
                    MyQuery.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
            }else{
                for(var a = 0; a < num; a++){
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe600;";
                    MyQuery.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
                var pot = document.createElement("i");
                pot.innerHTML = "&#xe601";
                MyQuery.addClass(pot, "iconfont");
                star.appendChild(pot);
                for(var a = 0; a < 5 - num - 1; a++){
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe602;";
                    MyQuery.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
            }





            average.innerHTML = "人均" + data[i].average + "元";
            MyQuery.addClass(infoLeftBottom, "info-left-bottom");
            distance.innerHTML = data[i].distance;
            MyQuery.addClass(infoRight, "info-right");
            big.innerHTML = data[i].discount;
            p.innerHTML = "折";
            p.insertBefore(big, p.childNodes[0]);
            infoRight.appendChild(p);//info-right添加完成


            if(data[i].flag){
                var str = data[i].flag.split("|");
                for(var i in str){
                    var li = document.createElement("li"),
                        img = document.createElement("img");
                    img.src = "src/images/" + str[i] + ".png";
                    li.appendChild(img);
                    ul.appendChild(li);
                }
            }

            h3.appendChild(star);
            h3.appendChild(average);//h3
            if(data[i].good == 0){
                var others = document.createElement("span");
                MyQuery.addClass(others, "others");
                others.innerHTML = data[i].people + "已享";
                infoLeftBottom.appendChild(others);
            }else{
                var good = document.createElement("img"),
                    friends = document.createElement("span");
                MyQuery.addClass(good, "good");
                MyQuery.addClass(friends, "freinds");
                good.src = "src/images/good.png";
                friends.innerHTML = data[i].good + "位朋友";
                infoLeftBottom.appendChild(good);
                infoLeftBottom.appendChild(friends);
            }
            infoLeftBottom.appendChild(distance);//info-left-bottom
            infoLeft.appendChild(h2);
            infoLeft.appendChild(h3);
            infoLeft.appendChild(infoLeftBottom);//info-left

            listInfo.appendChild(infoLeft);
            listInfo.appendChild(infoRight);
            listInfo.appendChild(ul);//list-info

            list.appendChild(listPreview);
            list.appendChild(listInfo);//list

            section.appendChild(list);//section
            body.insertBefore(section, footer);//插入完成。。好累
        }
    }

    function getData(){
        if(iSure){
            iSure = false;
            MyQuery.post(url, function(res){
                var response = JSON.parse(res.response);
                //console.log(response);
                //console.log(sendData);
                appendList(response.data);
                start += len;
                sendData = "start=" + start + "&len=" + len;
                footer.style.display = "none";
                iSure = true;
            }, sendData);
        }
    }
})();