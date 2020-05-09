<template>
    <div class="job_detial">
        <div class="job_detial_header">
            <router-link to="/comicList" class="flex_child"><span class="icon-left"></span></router-link>
            <h3>漫画</h3>
        </div>

        <!---->
        <div>
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
                    <el-row style="bottom: 0px; top: 0px; right: 0px; left: 20px;">
                        <el-col :span="24">
                            <span class="spantest">{{ tableData.name }}</span>
<!--                            <p style="font-size: 25px; width: 452px" class="spantest" >{{tableData.name}}</p>-->
                        </el-col>
                        <el-col :span="24">
                            <div class="block">
                                <span class="demonstration">收藏</span>
                                <el-tooltip class="item" effect="dark" content="添加收藏" placement="right">
                                    <el-button v-if="tableData.userFavorite==null" size="small" type="primary" icon="el-icon-star-off"
                                               @click="addFavorite(tableData)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="取消收藏" placement="right">
                                    <el-button v-if="tableData.userFavorite!==null" size="small" type="primary" icon="el-icon-star-on"
                                               @click="deleteFavorite(tableData)"></el-button>
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-row class="row-ul" gutter="20" style="margin-top: 1rem" >
                <el-col
                        v-for="address in tableData.address"
                        :span="12"
                        :key="address"
                        class="row-li"
                        @click.native="handleClick"
                        style="height:400px"
                >
                    <el-image :src="address" :preview-src-list="tableData.address" fit="fill"></el-image>
                </el-col>
            </el-row>
            <el-row style="width: 60%; left: 20%;"></el-row>
        </div>

    </div>
</template>

<script>
    import {getDetil} from "@/api/pictureDetail"
    // 引入video样式
    import "video.js/dist/video-js.css"
    import "vue-video-player/src/custom-theme.css"
    import {addHistory} from "@/api/viewHistory";
    import {addFavorite, deleteFavorite} from "@/api/userFavorite";
    export default {
        name: 'comicDetail',
        data() {
            return {
                tableData: [],
                querylist: [],
                editableTabsValue: "",
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
                srcList: [
                    // 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                    // 'http://127.0.0.1:8081/website/resources/_MG_0177.jpg'
                ],
                viewHistory: {
                    type: null,
                    videoId: null,
                    startData: '',
                    watchTime: ''
                },
                addFavoriteParms: {
                    type: null,
                    videoId: null
                },
            }
        },
        computed: {},
        methods: {
            getDetil() {
                getDetil({id: this.$route.params.id}).then(res => {
                    const currentTime = Date.now();

                    this.viewHistory.type = 5;
                    this.viewHistory.videoId = res.id;
                    console.log(res)
                    this.tableData = res
                });
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
                sessionStorage.setItem(
                    "listQuery_comic_picture",
                    JSON.stringify(this.listQuery)
                );
                sessionStorage.setItem("refresh_comic_picture", true);
                this.getPageList();
            },
            getActor(actor) {
                event.stopPropagation();
                this.listQuery.actorName = actor;
                this.listQuery.types = null;
                sessionStorage.setItem(
                    "listQuery_comic_picture",
                    JSON.stringify(this.listQuery)
                );
                sessionStorage.setItem("refresh_comic_picture", true);
                this.getPageList();
            },
            jump() {
                alert("111");
            },
            showimg() {
                const arr = [];
                arr.push("http://127.0.0.1:8081/website/resources/_MG_0170.jpg");
                arr.push("http://127.0.0.1:8081/website/resources/_MG_0177.jpg");
                this.srcList = arr;
            },
            saveViewHistory() {
                addHistory(this.viewHistory).then(res => {

                })
            },
            addFavorite(data) {
                this.addFavoriteParms.videoId = data.id;
                this.addFavoriteParms.type = 5;
                addFavorite(this.addFavoriteParms).then(res => {
                    this.tableData.userFavorite = res;
                }).catch(res => {
                    this.getDetil();
                })
            },
            deleteFavorite(data) {
                deleteFavorite({id: this.tableData.userFavorite.id}).then(res => {
                    this.tableData.userFavorite = null;
                }).catch(res => {
                    this.getDetil();
                })
            },
        },
        // 創建后挂载到root之后调用该钩子函数
        mounted() {
            window.addEventListener("scroll", this.willscroll);
            this.video = this.$refs.video;
        },
        // 该实例被创建还没挂载root之前，ajax可以在这里
        created() {
            this.viewHistory.startData = Date.now();
            this.getDetil();
        },
        beforeRouteLeave(to, form, next) {
            sessionStorage.setItem(
                "listQuery_video_detail",
                JSON.stringify(this.querylist)
            );
            sessionStorage.setItem("refresh_video_detail", true);
            const currentTime = Date.now();

            this.viewHistory.watchTime = currentTime - this.viewHistory.startData;
            this.viewHistory.startData = new Date(this.viewHistory.startData);
            this.saveViewHistory();
            next();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
    .spantest {
        overflow: hidden;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        font-size: 25px
    }
</style>
