/**
 * Created by Alkali on 15/8/30.
 */
;(function () {
    var body = document.querySelector("body"),
        footer = document.querySelector("footer"),
        panel = document.querySelector("#panel");
    url = 'http://usenodejs.alkalixin.cn/list';
    var start = 0,
        len = 3,
        iSure = true,
        once = true;
    var sendData = {
        start: start,
        len: len
    };
    getData();
    window.onscroll = function () {
        var totalHeigh = document.body.offsetHeight,
            scrollTop = document.body.scrollTop,
            height = document.documentElement.clientHeight;

        if (scrollTop / (totalHeigh - height) >= 0.95 && once) {
            footer.style.display = "block";
            getData();
        }
    };
    function appendList(data) {
        var footer = document.querySelector("footer");
        for (var i in data) {
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
            _.addClass(section, "list-wrap");
            _.addClass(list, "list");
            _.addClass(star, "star");
            _.addClass(listPreview, "list-img");
            listPreview.src = data[i].imgUrl;
            _.addClass(listInfo, "list-info");
            _.addClass(listInfo, "claerfix");
            _.addClass(infoLeft, "info-left");

            h2.innerHTML = data[i].title;


            //添加星星
            var stars = data[i].stars,
                num = parseInt(stars.split("."[0]));
            if (stars == "0") {
                for (var a = 0; a < 5; a++) {
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe602;";
                    _.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
            } else if (stars == "5") {
                for (var a = 0; a < 5; a++) {
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe600;";
                    _.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
            } else {
                for (var a = 0; a < num; a++) {
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe600;";
                    _.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
                var pot = document.createElement("i");
                pot.innerHTML = "&#xe601";
                _.addClass(pot, "iconfont");
                star.appendChild(pot);
                for (var a = 0; a < 5 - num - 1; a++) {
                    var icon = document.createElement("i");
                    icon.innerHTML = "&#xe602;";
                    _.addClass(icon, "iconfont");
                    star.appendChild(icon);
                }
            }


            average.innerHTML = "人均" + data[i].average + "元";
            _.addClass(infoLeftBottom, "info-left-bottom");
            distance.innerHTML = data[i].distance;
            _.addClass(infoRight, "info-right");
            big.innerHTML = data[i].discount;
            p.innerHTML = "折";
            p.insertBefore(big, p.childNodes[0]);
            infoRight.appendChild(p);//info-right添加完成


            if (data[i].flag) {
                var str = data[i].flag.split("|");
                for (var i in str) {
                    var li = document.createElement("li"),
                        img = document.createElement("img");
                    img.src = "images/" + str[i] + ".png";
                    li.appendChild(img);
                    ul.appendChild(li);
                }
            }

            h3.appendChild(star);
            h3.appendChild(average);//h3
            if (data[i].good == 0) {
                var others = document.createElement("span");
                _.addClass(others, "others");
                others.innerHTML = data[i].people + "已享";
                infoLeftBottom.appendChild(others);
            } else {
                var good = document.createElement("img"),
                    friends = document.createElement("span");
                _.addClass(good, "good");
                _.addClass(friends, "freinds");
                good.src = "images/good.png";
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

    function getData() {
        if (iSure) {
            iSure = false;
            _.ajax({
                type: 'post',
                url: url,
                data: sendData,
                success: function (res) {
                    var response = JSON.parse(res);


                    for(var i = 0; i < response.data.length; i++){

                        if(response.data[i].isEnd && once === true){
                            iSure = false;
                            once = false;
                            panel.style.display = "block";
                            setTimeout(function () {
                                _.fade(panel, 0, 50);
                            }, 2000);
                            footer.style.display = "none";
                            return;
                        }

                    }
                    appendList(response.data);
                    start += len;
                    sendData = {
                        start: start,
                        len: len
                    };
                    console.log(sendData.start);
                    footer.style.display = "none";
                    iSure = true;
                },
                fail: function (res) {
                    console.log(res);
                }
            })
        }
    }
})();