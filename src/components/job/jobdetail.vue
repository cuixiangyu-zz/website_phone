<template>
    <div class="job_detial">
        <div class="job_detial_header">
            <router-link to="/home" class="flex_child"><span class="icon-left"></span></router-link>
            <h3>{{scrollInfo}}</h3>

        </div>
        <div class="head-tab" ref="wrapper">
            <ul class="clear">
                <li v-for="(item,index) in titleData" :key="item.id" @click="tabChange(item.id)">
                    {{item.name}}<span class="icon-down"></span></li>
            </ul>

            <tableView ref="judge" :tabData="tabData1" :nowIndex="nowIndex" @hide="hide" @indexData="indexData"
                       @btnSure="btnSure" v-show="showHide" :name="nowIndex"></tableView>

        </div>
        <!---->
        <div v-if="tabData.selectedType===1">
            <el-container>
                <el-header></el-header>
            </el-container>
            <el-row type="flex">
                <el-col>
                    <el-card>
                        <el-image :key="tableData.id" :src="tableData.coverUrl" :lazy="true"
                                  fit="fill"></el-image>
                    </el-card>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-row style="bottom: 0px; top: 0px; right: 20px; left: 20px;">
                        <el-col :span="24" style="width: 88%;left: 6%">
                            <p style="font-size: 25px; ">{{tableData.name}}</p>
                        </el-col>
                        <el-col :span="24">
                            <div class="block">
                                <span class="demonstration">评分</span>
                                <el-rate v-model="tableData.level" :colors="colors"
                                         @change="changelevel(tableData)"></el-rate>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <p style="font-size: 17px; ">作者</p>
                            <el-col
                                    v-for="actor in tableData.actors"
                                    :span="4"
                                    :key="actor.id"
                                    class="row-li"
                                    @click="getActor(actor.id)"
                            >
                                <el-tag>{{actor.chineseName}}</el-tag>
                            </el-col>
                        </el-col>
                        <el-col :span="24">
                            <p style="font-size: 17px; width: 20%;">分类</p>
                            <el-col
                                    v-for="type in tableData.types"
                                    :span="4"
                                    :key="type.id"
                                    class="row-li"
                                    @click="getType(type)"
                            >
                                <el-tag>{{type.chineseName}}</el-tag>
                            </el-col>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-row style="width: 90%; left: 5%;" v-for="video in tableData.video" :key="video.poster">
                <div class="player-container">
                    <video-player
                            class="vjs-custom-skin"
                            :options="video"
                            @keyup.left="down"
                            @keyup.right="up"
                    ></video-player>
                </div>
            </el-row>
            <el-row style="width: 60%; left: 20%;"></el-row>
        </div>
    </div>
</template>

<script>
    import {getVideoDetil} from "@/api/videoDetail"
    // 引入video样式
    import "video.js/dist/video-js.css"
    import "vue-video-player/src/custom-theme.css"

    export default {
        name: 'detail',
        data() {
            return {
                scrollInfo: "职位详情",
                apiUrl: "",
                tempInfo: "",
                id: "",
                isSelected: false,
                showHide: false,
                // 匹配的新数据
                // 温馨提示都一样
                // 推荐职位
                tableData: null,
                querylist: [],
                editableTabsValue: "",
                video: undefined,
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                    actorName: null,
                    pictureName: null,
                    language: null,
                    types: null
                },
                typeMap: "",
                actors: "",
                deviceDetail: null,
                imgSrc: "http://127.0.0.1:8081/website/resources/_MG_0138.jpg",
                url: "http://127.0.0.1:8081/website/resources/_MG_0138.jpg",
                level: {
                    id: null,
                    level: null
                },
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                titleData: [{title: "日本", id: 1}, {title: "欧美", id: 2}, {title: "动漫", id: 3}, {title: "漫画", id: 3}],
                tabData: {
                    japan: [],
                    american: [],
                    animate: [],
                    comic: [],
                    selectedId: 1,
                    selectedType: 1
                },
                nowIndex: 1,
                tabData1: null
            }
        },
        computed: {},
        methods: {
            // 返回上一次路由
            // goBack(){
            //   this.$router.back();
            // },
            willscroll() {
                //2.1 使用定时器，防止频繁滚动
                if (window.scrollTime) {
                    window.clearTimeout(window.scrollTime);
                }
                //2.2 定时器
                window.scrollTime = window.setTimeout(() => {
                    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    this.scrollInfo = (scrollTop > 30) ? this.need_job : "职位详情";
                    // console.log(scrollTop);
                }, 100);
            },
            toggleMore() {
                this.isMore = !this.isMore;
            },
            toggleSelect() {
                this.isSelected = !this.isSelected;
            },
            tabChange(index) {
                this.tableIndex = index;
                this.tabData1 = this.tabData[index];
                this.nowIndex = this.indexSub[index];
                this.showHide = true;
                this.$refs.judge.judgeIndex(this.nowIndex);
                //调用子组件的方法
            },
            hide() {
                this.showHide = false;
            },
            getDetil() {
                var tabData = sessionStorage.getItem("tabData");
                this.tabData.selectedId = this.$route.params.id
                if (tabData !== null &&
                    tabData !== undefined &&
                    tabData !== "") {
                    this.tabData = JSON.parse(tabData);
                }
                if (
                    this.tabData.selectedId !== null &&
                    this.tabData.selectedId !== undefined &&
                    this.tabData.selectedId !== ""
                ) {
                    console.log("ssssssssssssssssssssssssssssssssss")
                    this.tabData.selectedType = 1;
                    // this.tabData.selectedId = queryList.id;
                    console.log(this.tabData.selectedType)
                    if (this.tabData.selectedType === 1) {
                        this.tabData.japan.push(this.tabData.selectedId)
                    } else if (this.tabData.selectedType === 2) {
                        this.tabData.american.push(this.tabData.selectedId)
                    } else if (this.tabData.selectedType === 3) {
                        this.tabData.animate.push(this.tabData.selectedId)
                    } else if (this.tabData.selectedType === 4) {
                        this.tabData.comic.push(this.tabData.selectedId)
                    }
                    this.tabData1 = this.tabData.japan
                }
                if (this.tabData.selectedType === 1) {
                    getVideoDetil({id:this.tabData.selectedId}).then(res => {
                        var srcList = []
                        for (const i of res.address) {
                            const videoinfo = {
                                playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
                                autoplay: false, // 如果true,浏览器准备好时开始回放。
                                controls: true, // 控制条
                                preload: "auto", // 视频预加载
                                muted: false, // 默认情况下将会消除任何音频。
                                loop: false, // 导致视频一结束就重新开始。
                                language: "zh-CN",
                                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                sources: [
                                    {
                                        src: i
                                    }
                                ],
                                poster: res.coverUrl,
                                width: document.documentElement.clientWidth,
                                notSupportedMessage: "此视频暂无法播放，请稍后再试" // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                            };
                            srcList.push(videoinfo);
                        }
                        res.video = srcList
                        this.tableData = res
                        console.log(this.tableData)
                    });
                }


                console.log(this.tableData);
            },
            getType(type) {
                event.stopPropagation();
                const arr = [];
                const arr1 = [];
                arr.push("allTypes");
                arr.push(type.id);
                arr1.push(arr);
                this.listQuery.types = arr1;
                this.listQuery.actorName = null;
                console.log(this.listQuery);
                this.jump();
            },
            getActor(actor) {
                event.stopPropagation();
                this.listQuery.actorName = actor;
                this.listQuery.types = null;
                this.jump();
            },
            jump() {
                this.$router.push({
                    path: "/video/index",
                    name: "影片" // 要跳转的路径的 name,可
                });
            },
            showimg() {
                const arr = [];
                arr.push("http://127.0.0.1:8081/website/resources/_MG_0170.jpg");
                arr.push("http://127.0.0.1:8081/website/resources/_MG_0177.jpg");
                this.srcList = arr;
            },
            up() {
                var time = this.video.currentTime;
                console.log(time);
                this.video.currentTime = time + 120;
            },
            down() {
                var time = this.video.currentTime;
                console.log(time);
                this.video.currentTime = time - 120;
            },
            changelevel(item) {
                this.level.id = item.id;
                changelevel(this.level);
            },
            hide() {
                this.showHide = false;
            },
            indexData() {
                this.nowIndex = [0];
                //			var title=this.titleData[this.tableIndex].title;
                //			this.titleData[this.tableIndex].title=title.replace(/[^\u4e00-\u9fa5]+/,"")+"("+number+")";
            },
            btnSure(number, indexData) {
                this.indexSub[this.tableIndex] = indexData;
                let title = this.titleData[this.tableIndex].title;
                if (number != 0) {
                    this.titleData[this.tableIndex].title =
                        title.replace(/[^\u4e00-\u9fa5]+/, "") + "(" + number + ")";
                } else {
                    this.titleData[this.tableIndex].title = title.replace(
                        /[^\u4e00-\u9fa5]+/,
                        ""
                    );
                }

                this.showHide = false;
            }

        },
        // 創建后挂载到root之后调用该钩子函数
        mounted() {
            window.addEventListener("scroll", this.willscroll);
            this.video = this.$refs.video;
        },
        // 该实例被创建还没挂载root之前，ajax可以在这里
        created() {
            this.getDetil();
        },
        beforeRouteLeave(to, form, next) {
            sessionStorage.setItem(
                "listQuery_video_detail",
                JSON.stringify(this.querylist)
            );
            sessionStorage.setItem("refresh_video_detail", true);
            next();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
</style>
