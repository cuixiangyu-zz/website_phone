<template>
    <div id="main">
        <!--固定的顶部-->
        <div class="main_fixed_top">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="1">漫画</el-menu-item>
                <el-menu-item index="2">我的收藏</el-menu-item>
                <el-menu-item index="3">浏览记录</el-menu-item>
            </el-menu>
        </div>
        <!--列表-->


        <div class="job_content" id="comicList" ref="wrapper" v-if="tab===1">
            <el-row class="row-ul" gutter="20"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50">
                <el-col
                        v-for="item in tableData.comicList.list"
                        :span="12"
                        :key="item.id"
                        class="row-li"
                        @click.native="handleClick"
                        style="height:400px"
                >
                    <el-card :body-style="{ padding: '0px' }">
                        <el-image :src="item.coverUrl" :preview-src-list="item.address" @click="showimg"
                                  lazy></el-image>
                        <div style="padding: 14px;" @click="jump(item.id)">
                            <span class="spantest">{{ item.name }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.actorname }}</time>
                                <span class="tag-group__title">类型:</span>
                                <el-tag
                                        v-for="types in item.types"
                                        :key="types.id"
                                        size="mini"
                                        effect="plain"
                                        @click="getType(types)"
                                >{{ types.chineseName }}
                                </el-tag>
                            </div>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.actorname }}</time>
                                <span class="tag-group__title">作者:</span>
                                <el-tag
                                        v-for="actors in item.actors"
                                        :key="actors.id"
                                        size="mini"
                                        effect="plain"
                                        @click="getActor(actors.id)"
                                >{{ actors.chineseName }}
                                </el-tag>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                客官您滑慢点...
            </div>
        </div>

        <div class="job_content" id="comicFavorite" ref="wrapper" v-if="tab===2">
            <el-row class="row-ul" gutter="20"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50">
                <el-col
                        v-for="item in tableData.comicFavorite.list"
                        :span="12"
                        :key="item.id"
                        class="row-li"
                        @click.native="handleClick"
                        style="height:400px"
                >
                    <el-card :body-style="{ padding: '0px' }">
                        <el-image :src="item.picture.coverUrl" :preview-src-list="item.picture.address" @click="showimg"
                                  lazy></el-image>
                        <div style="padding: 14px;" @click="jump(item.picture.id)">
                            <span class="spantest">{{ item.picture.name }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.picture.actorname }}</time>
                                <span class="tag-group__title">类型:</span>
                                <el-tag
                                        v-for="types in item.picture.types"
                                        :key="types.id"
                                        size="mini"
                                        effect="plain"
                                        @click="getType(types)"
                                >{{ types.chineseName }}
                                </el-tag>
                            </div>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.picture.actorname }}</time>
                                <span class="tag-group__title">作者:</span>
                                <el-tag
                                        v-for="actors in item.actors"
                                        :key="actors.id"
                                        size="mini"
                                        effect="plain"
                                        @click="getActor(actors.id)"
                                >{{ actors.chineseName }}
                                </el-tag>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                客官您滑慢点...
            </div>
            <div v-show="noMore" class="page-infinite-loading">
                暂无更多...
            </div>
        </div>

        <div class="job_content" id="comicHistory" ref="wrapper" v-if="tab===3">
            <el-row class="row-ul" gutter="20"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50">
                <el-col
                        v-for="item in tableData.comicHistory.list"
                        :span="12"
                        :key="item.id"
                        class="row-li"
                        @click.native="handleClick"
                        style="height:400px"
                >
                    <el-card :body-style="{ padding: '0px' }">
                        <el-image :src="item.picture.coverUrl" :preview-src-list="item.picture.address" @click="showimg"
                                  lazy></el-image>
                        <div style="padding: 14px;" @click="jump(item.picture.id)">
                            <span class="spantest">{{ item.picture.name }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.picture.actorname }}</time>
                                <span class="tag-group__title">类型:</span>
                                <el-tag
                                        v-for="types in item.picture.types"
                                        :key="types.id"
                                        size="mini"
                                        effect="plain"
                                        @click="getType(types)"
                                >{{ types.chineseName }}
                                </el-tag>
                            </div>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.picture.actorname }}</time>
                                <span class="tag-group__title">作者:</span>
                                <el-tag
                                        v-for="actors in item.actors"
                                        :key="actors.id"
                                        size="mini"
                                        effect="plain"
                                        @click="getActor(actors.id)"
                                >{{ actors.chineseName }}
                                </el-tag>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                客官您滑慢点...
            </div>
            <div v-show="noMore" class="page-infinite-loading">
                暂无更多...
            </div>
        </div>
        <!--返回顶部-->
        <!-- <img v-show="willshow" @click="gotop" src="/static/images/backTop.png" class="backTop" alt=""> -->
    </div>
</template>

<script>
    // 推荐子组件
    import slideTabComp from './slideTabComp.vue'
    // 城市选择组件
    import selectCityComp from './selectCityComp.vue'
    // 公司和要求公用一个子组件
    import compRequireComp from './compRequireComp.vue'

    import {getPageList} from '@/api/picture'
    import {
        getHistory
    } from '@/api/viewHistory'
    import {
        getList
    } from '@/api/userFavorite'

    export default {
        data() {
            return {
                noMore: false,
                willshow: false,
                timer: null,
                mainscroll: null,
                apiUrl: '',
                jobs: [],
                temp: [],
                jobId: '',
                loading: false,
                allLoaded: false,
                wrapperHeight: 0,
                tableData: {
                    comicList: [],
                    comicFavorite: [],
                    comicHistory: [],
                },
                listQuery: {
                    comicList: {
                        pageNum: 1,
                        pageSize: 10,
                        actorName: null,
                        videoName: null,
                        types: null,
                        videoType: 5,
                        currentPage: 1
                    },
                    comicFavorite: {
                        type: 5,
                        level: '',
                        pageSize: 10,
                        pageNum: 1,
                        load: true
                    },
                    comicHistory: {
                        type: 5,
                        startTime: null,
                        endTime: null,
                        pageSize: 10,
                        pageNum: 1,
                        load: true
                    }
                },
                typeMap: '',
                actors: '',
                deviceDetail: null,
                imgSrc: 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                url: 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                srcList: [
                    // 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                    // 'http://127.0.0.1:8081/website/resources/_MG_0177.jpg'
                ],
                activeName: '',
                activeIndex: '1',
                tab: 1,
            }
        },
        components: {
            slideTabComp,
            selectCityComp,
            compRequireComp
        },
        computed: {},
        methods: {
            // 3、接收子传来的选项
            fromChild(msg) {
                this.navlist[0].title = msg
                // console.log(msg);
            },
            ///4、接收子传来的是否隐藏
            hide() {
                // this.isShowSlide=false;
                this.navlist.filter(value => {
                    value.isSelected = false
                })
            },
            // 5、切换的时候动态改变要传递到子组件的数据：this.slideTemp
            changeColor(nav, index) {
                let _this = this
                this.slideIndex = index
                this.slideTemp = this.slideData[index]
                if (nav.isSelected) {
                    nav.isSelected = false
                } else {
                    // 先清空所有选中效果
                    this.navlist.filter(value => {
                        value.isSelected = false
                    })
                    // 设置当前选中效果
                    nav.isSelected = true
                }
                // console.log(this.slideIndex);
            },
            willscroll() {
                //2.1 使用定时器，防止频繁滚动
                if (window.scrollTime) {
                    window.clearTimeout(window.scrollTime)
                }
                //2.2 定时器
                window.scrollTime = window.setTimeout(() => {
                    const scrollTop =
                        document.documentElement.scrollTop ||
                        window.pageYOffset ||
                        document.body.scrollTop
                    this.willshow = scrollTop > 300 ? true : false
                    // console.log("滚动了");
                }, 100)
            },
            //3 返回顶部
            gotop() {
                this.willshow = !this.willshow
                let d = document.documentElement
                let b = document.body
                // console.log(this.timer,d,b);
                this.timer = window.setInterval(() => {
                    d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1)
                    b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1)
                    //到达顶部清除定时器，重新绑定滚动事件
                    if (d.scrollTop + b.scrollTop === 0)
                        clearInterval(this.timer, (window.onscroll = this.willscroll))
                }, 10)
            },
            loadData() {
                let _this = this
                this.$http
                    .get(_this.apiUrl)
                    .then(response => {
                        if (response.data.code == '0') {
                            _this.jobs = response.data.main
                            // 模擬每次下拉加載的10條假數據
                            _this.temp = response.data.main
                            // console.log(response.data);
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            // 模擬無限下拉加載
            loadMore() {
              if(this.loading === true){
                return;
              }
                if (this.tab === 1) {
                    this.loading = true;
                    this.noMore = false;
                    getPageList(this.listQuery.comicList).then(res => {
                      this.listQuery.comicList.currentPage = this.listQuery.comicList.pageNum;
                        this.listQuery.comicList.pageNum = this.randomNum(1, res.PageInfo.pages);
                        if (this.tableData.comicList.length <= 0) {
                            this.tableData.comicList = res.PageInfo
                        } else {
                            this.tableData.comicList.list = this.tableData.comicList.list.concat(res.PageInfo.list)
                        }
                      this.loading = false
                    })
                } else if (this.tab === 2&&this.listQuery.comicFavorite.load) {
                    this.loading = true;
                    this.noMore = false;
                    getList(this.listQuery.comicFavorite).then(res => {
                        if(res.pageNum>=res.pages){
                            this.listQuery.comicFavorite.load = false;
                        }else{
                            this.listQuery.comicFavorite.pageNum = res.pageNum+1;
                        }
                        if (this.tableData.comicFavorite.length <= 0) {
                            this.tableData.comicFavorite = res
                        } else {
                            this.tableData.comicFavorite.list = this.tableData.comicFavorite.list.concat(res.list)
                        }
                      this.loading = false
                    })
                } else if (this.tab === 3&&this.listQuery.comicHistory.load) {
                    this.loading = true;
                    this.noMore = false;
                    getHistory(this.listQuery.comicHistory).then(res => {
                        if(res.pageNum>=res.pages){
                            this.listQuery.comicHistory.load = false;
                            this.listQuery.comicHistory.pageNum = res.pageNum
                        }else{
                            this.listQuery.comicHistory.pageNum = res.pageNum+1;
                        }
                        if (this.tableData.comicHistory.length <= 0) {
                            this.tableData.comicHistory = res
                        } else {
                            this.tableData.comicHistory.list = this.tableData.comicHistory.list.concat(res.list)
                        }
                      this.loading = false
                    })
                }else {
                    this.noMore = true;
                  this.loading = false
                }

            },
            // 4.1、阻止局部滚动到达边界后会造成页面继续滚动(不合适)
            stopScroll() {
                let container = document.getElementById('jobcontent')
                // console.log(container);
                container.addEventListener(
                    'touchmove',
                    function (event) {
                        event.preventDefault()
                    },
                    false
                )
            },
            // 4、2把阻止事件remove
            removeStopScroll() {
                let container = document.getElementById('jobcontent')
                container.removeEventListener(
                    'touchmove',
                    function (event) {
                        event.preventDefault()
                    },
                    false
                )
            },
            getPageList() {
                this.noMore = false;
                var listQuery = sessionStorage.getItem('listQuery_comic_video')
                var refresh = sessionStorage.getItem('refresh_comic_video')
                if (listQuery !== null && refresh !== null && refresh === 'true') {
                    this.listQuery = JSON.parse(listQuery)
                }
              this.listQuery.comicList.pageNum = this.listQuery.comicList.currentPage;
                getPageList(this.listQuery.comicList).then(res => {
                    this.listQuery.comicList.pageNum = this.randomNum(1, res.PageInfo.pages);
                    this.tab = 1;
                    this.tableData.comicList = res.PageInfo
                })
            },
            getFavoriteList() {
                this.noMore = false;
                getList(this.listQuery.comicFavorite).then(res => {
                    if(res.pageNum>=res.pages){
                        this.listQuery.comicFavorite.load = false;
                        this.listQuery.comicFavorite.pageNum = res.pageNum
                    }else{
                        this.listQuery.comicFavorite.pageNum = res.pageNum+1;
                    }
                    this.tab = 2;
                    this.tableData.comicFavorite = res
                })
            },
            getHistoryList() {
                this.noMore = false;
                getHistory(this.listQuery.comicHistory).then(res => {
                    if(res.pageNum>=res.pages){
                        this.listQuery.comicHistory.load = false;
                        this.listQuery.comicHistory.pageNum = res.pageNum
                    }else{
                        this.listQuery.comicHistory.pageNum = res.pageNum+1;
                    }
                    this.tab = 3;
                    this.tableData.comicHistory = res
                })
            },
            handleCurrentChange(index) {
                this.listQuery.pageNum = index
                sessionStorage.setItem('refresh_comic_video', false)
                this.getPageList()
            },
            handleSizeChange(pageSize) {
                this.listQuery.pageSize = pageSize
                sessionStorage.setItem('refresh_comic_video', false)
                this.getPageList()
            },
            handleSelect(tab, event) {
                console.log(tab);
                this.tab = tab;
                if (this.tab === '1') {
                    this.getPageList();
                } else if (this.tab === '2') {
                    this.getFavoriteList();
                } else if (this.tab === '3') {
                    this.getHistoryList();
                }
            },
            getType(type) {
                event.stopPropagation()
                const arr = []
                const arr1 = []
                arr.push('allTypes')
                arr.push(type.id)
                arr1.push(arr)
                this.listQuery.types = arr1
                this.listQuery.actorName = null
                console.log(this.listQuery)
                sessionStorage.setItem('refresh_comic_video', false)
                this.getPageList()
            },
            getActor(actor) {
                event.stopPropagation()
                this.listQuery.actorName = actor
                this.listQuery.types = null
                sessionStorage.setItem('refresh_comic_video', false)
                this.getPageList()
            },
            jump(videoid) {
              this.listQuery.comicList.pageNum = this.listQuery.comicList.currentPage;
                sessionStorage.setItem('listQuery_comic_video', JSON.stringify(this.listQuery))
                sessionStorage.setItem('refresh_comic_video', true)
                sessionStorage.setItem("refresh_comic_detail", true);
                sessionStorage.setItem("queryList", {id: videoid, type: 1});
                this.$router.push({
                    name: 'comicDetail', // 要跳转的路径的 name,可在 router 文件夹下的 index.js 文件内找
                    params: {id: videoid}
                })
            },
            showimg() {
                const arr = []
                arr.push('http://127.0.0.1:8081/website/resources/_MG_0177.jpg')
                arr.push('http://127.0.0.1:8081/website/resources/_MG_0170.jpg')
                this.srcList = arr
            },
            randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(Math.random() * minNum + 1, 10);
                        break;
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                        break;
                    default:
                        return 0;
                        break;
                }
            }

        },
        mounted() {
            // 去掉范湖底部事件监听
            // window.addEventListener("scroll", this.willscroll);
            this.wrapperHeight =
                document.documentElement.clientHeight -
                this.$refs.wrapper.getBoundingClientRect().top
            // console.log(this.$refs.wrapper.getBoundingClientRect().top);
        },
        created() {
            this.getPageList()
        },
        beforeRouteLeave(to, form, next) {
            this.listQuery.comicFavorite.pageNum = 1;
            this.listQuery.comicHistory.pageNum = 1;
          this.listQuery.comicList.pageNum = this.listQuery.comicList.currentPage;
            sessionStorage.setItem(
                "listQuery_comic_video",
                JSON.stringify(this.listQuery)
            );
            sessionStorage.setItem("refresh_comic_video", true);
            next()
        }
    }
</script>

<style lang="stylus" scoped>
    .spantest {
        overflow: hidden;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;

    }
</style>
