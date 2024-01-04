<template>
  <b-container id="wbcClassification" fluid>
    <b-row>
      <b-col class="p-0 pt-1">
        <b-card id="wbcInfoCard" class="blackCard" text-variant="white" no-body>
          <div class="panelTitle w-100 pr-2">
            <span>
              WBC Classification
            </span>
            <!-- <b-icon v-if="isLisShow && siteCd !== '0007'" class="ml-2 pointer absolute-icon"
              icon="file-earmark-arrow-up"
              font-scale="1.1"
              @click="onClickLisUpload"
              style="color: white;"></b-icon> -->
            <b-icon v-if="isLisShow" class="ml-2 pointer"
              icon="check-square"
              font-scale="1.1"
              @click="onCommit"
              v-b-tooltip.hover title="submit"
              style="color: #82FA58;"></b-icon>

            <b-icon v-if="isLock" class="mt-2 pointer float-right"
              icon="lock-fill"
              font-scale="0.8"
              @click="isLock = !isLock"
              v-b-tooltip.hover title="class draggable"
              style="color: white;">
            </b-icon>
            <b-icon v-else class="mt-2 pointer float-right"
              icon="unlock-fill"
              font-scale="0.8"
              @click="isLock = !isLock"
              v-b-tooltip.hover title="class draggable"
              style="color: white;">
            </b-icon>
          </div>
          <div id="divWbcWrapper">
            <b-row class="mt-2">
              <b-col cols="5">
                Class
              </b-col>
              <b-col class="text-center">
                Count
              </b-col>
              <b-col class="text-center">
                %
              </b-col>
            </b-row>

            <draggable v-if="!isLock" v-model="wbcClassList" group="wbc" @start="drag=true" @end="onListDragEnd">
               <div v-if="(wbc.CLASS_TITLE !== 'NR' && wbc.CLASS_TITLE !== 'AR' &&
                          wbc.CLASS_TITLE !== 'GP' && wbc.CLASS_TITLE !== 'PA' &&
                          wbc.CLASS_TITLE !== 'MC' && wbc.CLASS_TITLE !== 'MA' &&
                          wbc.CLASS_ID !== '90' && wbc.CLASS_ID !== '91' &&
                          wbc.CLASS_ID !== '92' && wbc.CLASS_ID !== '93' && wbc.CLASS_ID !== '94')"
                 v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.CLASS_ID">
                 <b-row>
                   <b-col cols="5">
                     {{ wbc.CLASS_NM }}
                   </b-col>
                   <b-col class="text-center">
                     {{ wbc.COUNT }}
                   </b-col>
                   <b-col class="text-center">
                     {{ wbc.PERCENT }}
                   </b-col>
                 </b-row>
               </div>
            </draggable>
            <div v-else>
              <div v-if="(wbc.CLASS_TITLE !== 'NR' && wbc.CLASS_TITLE !== 'AR' &&
                         wbc.CLASS_TITLE !== 'GP' && wbc.CLASS_TITLE !== 'PA' &&
                         wbc.CLASS_TITLE !== 'MC' && wbc.CLASS_TITLE !== 'MA' &&
                         wbc.CLASS_ID !== '90' && wbc.CLASS_ID !== '91' &&
                         wbc.CLASS_ID !== '92' && wbc.CLASS_ID !== '93' && wbc.CLASS_ID !== '94')"
                v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.CLASS_ID">
                <b-row>
                  <b-col cols="5">
                    {{ wbc.CLASS_NM }}
                  </b-col>
                  <b-col class="text-center">
                    {{ wbc.COUNT }}
                  </b-col>
                  <b-col class="text-center">
                    {{ wbc.PERCENT }}
                  </b-col>
                </b-row>
              </div>
            </div>
            <div v-if="(wbc.CLASS_ID === '90' || wbc.CLASS_ID === '91' ||
                        wbc.CLASS_ID === '92' || wbc.CLASS_ID === '93' || wbc.CLASS_ID === '94')"
              v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.CLASS_ID">
              <b-row>
                <b-col cols="5">
                  {{ wbc.CLASS_NM }}
                </b-col>
                <b-col class="text-center">
                  {{ wbc.COUNT }}
                </b-col>
                <b-col class="text-center">
                  {{ wbc.PERCENT }}
                </b-col>
              </b-row>
            </div>

            <div class="panelContent mt-2">
              <b-row>
                <b-col cols="5">
                  Total
                </b-col>
                <b-col class="text-center">
                  {{ totalCount }}
                </b-col>
                <b-col class="text-center">
                  100.00
                </b-col>
              </b-row>
            </div>

            <div class="mt-3">
              non-WBC
            </div>
            <div v-if="(wbc.CLASS_TITLE === 'NR' || wbc.CLASS_TITLE === 'AR' ||
              wbc.CLASS_TITLE === 'GP' || wbc.CLASS_TITLE === 'PA' ||
              wbc.CLASS_TITLE === 'MC' || wbc.CLASS_TITLE === 'MA')"
              v-for="wbc in wbcClassList" class="panelContent mt-2" :key="wbc.CLASS_ID">
              <b-row class="p-0">
                <b-col cols="5">
                  {{ wbc.CLASS_NM }}
                </b-col>
                <b-col class="text-center">
                  {{ wbc.COUNT }} <span v-if="wbc.CLASS_TITLE === 'NR' || wbc.CLASS_TITLE === 'GP'"> / {{ maxWbcCount }} WBC</span>
                </b-col>
                <b-col class="text-center">
                  <span v-if="wbc.CLASS_TITLE === 'NR'">{{ wbc.PERCENT }}</span>
                  <span v-else>-</span>
                </b-col>
              </b-row>
            </div>
          </div>
          <b-row v-if="!isReportPage">
            <b-col class="pointer" @click="onClickBefore">
              <div id="divWbcBefore">Before</div>
            </b-col>
            <b-col class="pointer" @click="onClickAfter">
              <div id="divWbcAfter">After</div>
            </b-col>
          </b-row>
        </b-card>
        <b-card class="blackCard mt-2 pt-3" text-variant="white" no-body>
          <b-row class="commentWrapper">
            <b-col cols="3">
              <img src="~@/assets/icon/Comment.png"/>
            </b-col>
            <b-col>
              <div class="input-group"
                style="background-color: #313131;
                border-radius: 10px;">
                <textarea id="inputWbcComment"
                  class="form-control"
                  rows="4"
                  aria-label="With textarea"
                  v-model="modelData.wbcComment"
                  @change="onChangeComment"
                  style="resize: none;"></textarea>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import lodash from 'lodash'
  import draggable from 'vuedraggable'
  import api from '@/service'
  import ModalReportSign from '../../../Common/ModalReportSign'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')
  const log = require('electron-log')

  export default {
    name: 'wbc-classification',
    components: { draggable },
    computed: {
      ...mapGetters({
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        currentWbcResult: Constant.GET_CURRENT_WBC_RESULTS,
        beforeWbcResult: Constant.GET_BEFORE_WBC_RESULTS,
        wbcCustomClass: Constant.GET_CUSTOM_CLASS,
        siteCd: Constant.GET_SITE_CD
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.maxWbcCount = this.selectedItem.MAX_WBC_COUNT
        this.modelData.wbcComment = this.selectedItem.WBC_COMMENT
      },
      currentWbcResult: function(newObj, oldObj) {
        console.log(newObj)
        if (!this.isBefore) {
          this.wbcClassList = lodash.cloneDeep(newObj)
          console.log('-------------')
          console.log('currentWbcResult')
          console.log(this.wbcClassList)
          console.log('-------------')
          this.totalCount = this.$getWbcTotalCount(this.wbcClassList)
          this.insertSlideInfo()
        }
      },
      beforeWbcResult: function(newObj, oldObj) {
        console.log(newObj)
        if (this.isBefore) {
          this.wbcClassList = lodash.cloneDeep(newObj)
          console.log('beforeWbcResult')
          console.log(this.wbcClassList)
          this.totalCount = this.$getWbcTotalCount(this.wbcClassList)
        }
      },
      wbcCustomClass: function(newObj, oldObj) {
        console.log(newObj)
      }
    },
    data () {
      return {
        totalCount: 0,
        selectedItem: null,
        wbcClassList: [],
        // isNonWbc: false,
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        isBefore: false,
        modelData: {
          wbcComment: ''
        },
        maxWbcCount: 0,
        isReportPage: false,
        isLisShow: false,
        isLock: true
      }
    },
    beforeDestroy () {
      this.EventBus.$off('UPDATE_HIST_LIST')

      // ipcRenderer.removeAllListeners(Constant.UPDATE_WBC_COMMENT)
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      // ipcRenderer.removeAllListeners(Constant.GET_WBC_HIST_LIST)
      // ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)

    },
    mounted () {
      var self = this

      console.log('wbc mount-')
      console.log(this.$route.path)

      this.$nextTick(function () {
        console.log(this.$route.path)
        if (this.$route.path.includes('finalReport')) {
          self.isReportPage = true
        }

        if (this.$route.path.includes('wbcReport')) {
          self.isLisShow = true
        }

        this.EventBus.$on('UPDATE_HIST_LIST', function(params) {
          console.log('recv UPDATE_HIST_LIST')
          self.initElement(self.orderId)

          // 파일 이동시에만 [UPDATE_HIST_LIST] insert or replace
          // if (self.selectedItem !== null) {
          //   // image path의 파일명만 저장
          //   var tmpClassList = lodash.cloneDeep(self.wbcClassList)
          //
          //   tmpClassList.forEach(function(wbc) {
          //     wbc.images.forEach(function(image, index) {
          //       var splitArray = image.split('/')
          //       wbc.images[index] = splitArray[splitArray.length - 1]
          //     })
          //   })
          //
          //   var params = {
          //     cassetId: self.selectedItem.CASSET_ID,
          //     slotId: self.selectedItem.SLOT_ID,
          //     wbcInfo: tmpClassList,
          //     userId: self.currentUser.userId,
          //     // PB 비정상 클래스 체크
          //     isNormal: self.$checkPbNormalCell(tmpClassList)
          //   }
          //
          //   console.log(params)
          //   ipcRenderer.send(Constant.INSERT_WBC_CLASSIFICATION, JSON.stringify(params))
          // }
        })
      })

    },
    methods: {
      onCommit () {
        this.EventBus.$emit('ON_CLICK_REPORT_SIGN', null)
      },
      onClickLisUpload () {
        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      onListDragEnd () {
        console.log('onListDragEnd')
        console.log(this.wbcClassList)
        var self = this

        this.wbcClassList.forEach(function(wbcItem, index) {
          wbcItem.ORDER_NO = index + 1
        })

        ipcRenderer.send(Constant.UPDATE_ORDER, JSON.stringify({
          wbcClassList: self.wbcClassList,
          userId: self.currentUser.userId,
          testType: self.selectedItem.TEST_TYPE
        }))

        console.log(this.$route.path)
        if (this.$route.path.indexOf('wbcReport') > 0) {
          this.EventBus.$emit('UPDATE_WBC_IMAGES', null)
        } else if (this.$route.path.indexOf('finalReport') > 0) {
          this.EventBus.$emit('WBC_CLASSIFICATION_LOADED', this.wbcClassList)
        }
      },
      // loadBeforeWbcClassification () {
        // ipcRenderer.send(Constant.GET_WBC_HIST_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
      // },
      // loadDirWbcImages () {
      //   var self = this
      //   var classDir = ''
      //   var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
      //
      //   console.log('loadDirWbcImages')
      //
      //   var classList = []
      //   if (self.selectedItem.TEST_TYPE === '01' || self.selectedItem.TEST_TYPE === '04') {
      //     classList = self.classList(self.selectedItem.IS_NS_NB_INTEGRATION)
      //     classDir = rootPath + '/' + self.settings.wbcClassDirName
      //
      //     // custom class append
      //     self.wbcCustomClass.forEach(function(wbcCustom) {
      //       if (wbcCustom.CLASS_TITLE !== '') {
      //         var obj = {
      //           count: 0,
      //           id: wbcCustom.CLASS_ID,
      //           key: '',
      //           name: wbcCustom.CLASS_NM,
      //           title: wbcCustom.CLASS_TITLE,
      //           order: Number(wbcCustom.CLASS_ID)
      //         }
      //         classList.push(obj)
      //       }
      //     })
      //
      //   } else {
      //     classList = self.bfClassList
      //     classDir = rootPath + '/' + self.settings.bfClassDirName
      //   }
      //
      //   var self = this
      //
      //   // wbc file load
      //   var params = {
      //     classList: classList,
      //     classDir: classDir,
      //     selectItem: this.selectedItem
      //   }
      //
      //   api.getWbcFiles(params)
      //   .then(function (res) {
      //     console.log(res)
      //     console.log(self.wbcClassList)
      //     // self.wbcClassList = res.classificationResult
      //     self.totalCount = res.imgCount
      //
      //     // 정렬 오류
      //     setTimeout(function () {
      //       // order
      //       res.classificationResult.sort(function(a, b) {
      //         return a.order - b.order
      //       })
      //
      //       if (self.wbcClassList === null) {
      //         self.wbcClassList = res.classificationResult
      //       }
      //
      //       self.wbcClassList.forEach(function(wbcItem) {
      //         res.classificationResult.forEach(function(result) {
      //           if (wbcItem.id === result.id) {
      //             wbcItem.count = result.count
      //           }
      //
      //           if ((wbcItem.title === 'NR' || wbcItem.title === 'AR' ||
      //               wbcItem.title === 'GP' || wbcItem.title === 'PA' ||
      //               wbcItem.title === 'MC' || wbcItem.title === 'MA') && wbcItem.count > 0) {
      //             self.isNonWbc = true
      //           } else {
      //             self.isNonWbc = false
      //           }
      //         })
      //       })
      //
      //       var params = {
      //         classificationResult: self.wbcClassList,
      //         imgCount: self.totalCount,
      //         siteCd: self.siteCd
      //       }
      //
      //       console.log(params)
      //       api.getWbcClassification(params)
      //       .then(function (res) {
      //         console.log(res)
      //         self.insertSlideInfo()
      //
      //       }).catch(function (err) {
      //         console.log(err.message)
      //       })
      //     }, 100)
      //
      //   }).catch(function (err) {
      //     console.log(err.message)
      //     if (err.err.code === 'ENOENT') {
      //       if (err.classId === '90' || err.classId === '91' ||
      //           err.classId === '92' || err.classId === '93' ||
      //           err.classId === '94') {
      //         // self.loadDirWbcImages()
      //       }
      //     }
      //   })
      // },
      insertSlideInfo() {
        var self = this
        self.EventBus.$emit('WBC_CLASSIFICATION_LOADED', self.wbcClassList)

        if (document.getElementById('divWbcBefore')) {
          document.getElementById('divWbcBefore').style.color = ''
        }

        if (document.getElementById('divWbcAfter')) {
          document.getElementById('divWbcAfter').style.color = 'red'
        }

        // 파일 이동시에만 [UPDATE_HIST_LIST] insert or replace
        // if (self.selectedItem !== null) {
        //   // image path의 파일명만 저장
        //   var tmpClassList = lodash.cloneDeep(self.wbcClassList)
        //
        //   tmpClassList.forEach(function(wbc) {
        //     wbc.images.forEach(function(image, index) {
        //       var splitArray = image.split('/')
        //       wbc.images[index] = splitArray[splitArray.length - 1]
        //     })
        //   })
        //
        //   var params = {
        //     cassetId: self.selectedItem.CASSET_ID,
        //     slotId: self.selectedItem.SLOT_ID,
        //     wbcInfo: tmpClassList,
        //     userId: self.currentUser.userId,
        //     // PB 비정상 클래스 체크
        //     isNormal: self.$checkPbNormalCell(tmpClassList).isNormal
        //   }
        //
        //   console.log(params)
        //   ipcRenderer.send(Constant.INSERT_WBC_CLASSIFICATION, JSON.stringify(params))
        // }
      },
      initElement(slotId) {
        var self = this
      },
      getPercent (count) {
        return ((Number(count) / this.totalCount) * 100).toFixed(0)
      },
      onChangeComment (evt) {
        var obj = {
          slotId: this.selectedItem.SLOT_ID,
          wbcComment: this.modelData.wbcComment
        }

        log.info('update comment : ' + JSON.stringify(obj))

        ipcRenderer.send(Constant.UPDATE_WBC_COMMENT, JSON.stringify({obj}))
        // this.EventBus.$emit(Constant.UPDATE_WBC_COMMENT, this.modelData.wbcComment)

        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })

      },
      onClickBefore (evt) {
        console.log('onClickBefore')

        this.isBefore = true
        ipcRenderer.send(Constant.GET_WBC_HIST_LIST, JSON.stringify({
          cassetId: this.selectedItem.CASSET_ID,
          slotId: this.selectedItem.SLOT_ID,
          testType: this.selectedItem.TEST_TYPE
        }))

        document.getElementById('divWbcBefore').style.color = 'red'
        document.getElementById('divWbcAfter').style.color = ''
      },
      onClickAfter (evt) {
        console.log('onClickAfter')

        this.isBefore = false
        ipcRenderer.send(Constant.GET_WBC_COUNT, JSON.stringify({
          cassetId: this.selectedItem.CASSET_ID,
          slotId: this.selectedItem.SLOT_ID,
          testType: this.selectedItem.TEST_TYPE
        }))

        document.getElementById('divWbcAfter').style.color = 'red'
        document.getElementById('divWbcBefore').style.color = ''
      }
    }
  }
</script>

<style>

  /* .absolute-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .absolute-icon {
    position: absolute;
    top: 280px;
    right: 70px;
    z-index: 1;
  } */

  #wbcInfoCard {
    height: 733px;
  }
  #divWbcWrapper {
    height: 755px;
    padding-bottom: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
