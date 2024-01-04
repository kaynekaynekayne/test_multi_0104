<template>
  <div id="malariaImage">
    <div v-drag-target id="43_InclusionBody_Malaria"
      class="data-draggable-target"
      data-draggable="target"
      @wheel.ctrl="zoom"
      style="text-align: left; overflow: auto; height: 500px;">
        <img class="data-draggable-item pointer"
          data-draggable="item"
          v-for="malaria, index in malariaList"
          :src="malaria"
          :id="'MA_' + index"
          :key="index"
          style="width: 120px;">
    </div>
    <div class="border-bottom">No Malaria</div>
    <div
      v-drag-target
      class="data-draggable-target pointer"
      id="44_InclusionBody_NoMalaria"
      data-draggable="target"
      @wheel.ctrl="zoom"
      style="text-align: left; overflow: auto; height: 250px;">
      <img class="data-draggable-item"
        data-draggable="item"
        v-for="noMalaria, index in noMalariaList"
        :src="noMalaria"
        :id="'NOMA_' + index"
        :key="index"
        style="width: 120px;">
    </div>
  </div>
</template>

<script>
  const fs = require('fs')
  const path = require('path')
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'
  import api from '@/service'

  export default {
    name: 'malaria-image',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        // workList: Constant.GET_WORK_LIST,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    data () {
      return {
        malariaList: [],
        noMalariaList: [],
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        moveCnt: 0,
        selectedItem: null,
        signedState: ''
      }
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj

        this.initElement()
      }
    },
    beforeDestroy () {
      this.$off('APPEND_CHILD')
      this.EventBus.$off('UPDATE_MALARIA')
    },
    mounted () {
      var self = this

      // document.getElementById(this.settings.malariaDirNm).style.height = '615px'
      // document.getElementById(this.settings.noMalariaDirNm).style.height = '160px'

      // this.selectedItem = JSON.parse(this.$route.params.selectedItem)

      // this.initElement()
      // this.setImageStyle()

      this.EventBus.$on('UPDATE_MALARIA', function(params) {
        console.log(params)
        self.selectedItem = params
        self.initElement()
      })

      this.$on('APPEND_CHILD', function(fileParams) {
        console.log('APPEND_CHILD')

        // var maxSize = fileParams.data.maxSize
        // var url = fileParams.data.image.currentSrc.split('/')
        // var fileName = url[url.length - 1]
        // var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
        // var srcPath = rootPath + '/' + self.settings.rbcClassDirName + '/' + fileParams.data.srcId + '/' + fileName
        // var destPath = rootPath + '/' + self.settings.rbcClassDirName + '/' + fileParams.data.targetId + '/' + fileName

        // 파일 폴더 이동
        // var params = {
        //   srcPath: srcPath,
        //   destPath: destPath
        // }

        console.log(fileParams)
        console.log(self.malariaList)
        var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
        var params = {
          path: rootPath + '/' + self.settings.rbcClassDirName,
          fileList: fileParams.data,
          cassetId: self.selectedItem.CASSET_ID,
          slotId: self.selectedItem.SLOT_ID,
          userId: self.currentUser.userId,
          length: fileParams.data.length,
          malariaCount: self.malariaList.length - fileParams.data.length,
          type: 'malaria',
          endPoint: 'image'
        }

        console.log(params)
        api.PbIaMoveImage(params).then(function(results) {
          console.log(results)
          self.initElement()

        }).catch(function(err) {
          console.log(err)
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        })

        // api.moveFile(params).then(function (res) {
        //   console.log(res)
        //   self.moveCnt++
        //
        //   if (fileParams.data.srcId === self.settings.malariaDirName) {
        //     // delete malaria image
        //     self.malariaList.forEach(function(malaria, index) {
        //       if (malaria === 'file://' + srcPath) {
        //         self.malariaList.splice(index, 1)
        //       }
        //     })
        //
        //     // push no malaria image
        //     self.noMalariaList.push('file://' + destPath)
        //
        //   } else {
        //     // delete no malaria image
        //     self.noMalariaList.forEach(function(noMalaria, index) {
        //       if (noMalaria === 'file://' + srcPath) {
        //         self.noMalariaList.splice(index, 1)
        //       }
        //     })
        //
        //     // push malaria image
        //     self.malariaList.push('file://' + destPath)
        //   }
        //
        //   // complete move files
        //   if (self.moveCnt === maxSize) {
        //     self.$nextTick(function () {
        //       setTimeout(function() {
        //         self.EventBus.$emit('MALARIA_MOVE_COMPLETE', self.malariaList.length)
        //         self.moveCnt = 0
        //
        //         // drag 활성화
        //         self.$initDrag()
        //       })
        //     })
        //   }
        // }).catch(function (err) {
        //   self.$toasted.show(err.message, {
        //     position: 'bottom-center',
        //     duration: '2000'
        //   })
        // })

       })
    },
    methods: {
      getSlideInfo () {
        console.log('getSlideInfo')
        // var self = this
        //
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: self.orderId}))
        //
        // ipcRenderer.once(Constant.GET_TEST_HISTORY, function (event, result) {
        //   console.log(result)
        //
        //   self.signedState = result.SIGNED_STATE
        //   self.initElement()
        // })
      },
      setImageStyle () {
        this.signedState = this.selectedItem.SIGNED_STATE

        if (this.selectedItem.SIGNED_STATE === this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
          document.getElementById(this.settings.malariaDirName).removeAttribute('class')
          document.getElementById(this.settings.malariaDirName).removeAttribute('aria-dropeffect')

          document.getElementById(this.settings.noMalariaDirName).removeAttribute('class')
          document.getElementById(this.settings.noMalariaDirName).removeAttribute('aria-dropeffect')

          var maChild = document.getElementById(this.settings.malariaDirName).childNodes
          var noChild = document.getElementById(this.settings.noMalariaDirName).childNodes

          for (var i = 0; i < maChild.length; i++) {
            maChild[i].removeAttribute('class')
            maChild[i].removeAttribute('draggable')
            maChild[i].removeAttribute('tabindex')
          }

          for (var i = 0; i < noChild.length; i++) {
            noChild[i].removeAttribute('class')
            noChild[i].removeAttribute('draggable')
            noChild[i].removeAttribute('tabindex')
          }
        }
      },
      initElement () {
        try {
          var self = this

          Promise.all([
            api.PbIaGetFiles({
              path: self.settings.pbiaRootPath + '/' +
                    self.selectedItem.SLOT_ID + '/' +
                    self.settings.rbcClassDirName + '/' +
                    self.settings.malariaDirName,
              endPoint: 'images'
            }),
            api.PbIaGetFiles({
              path: self.settings.pbiaRootPath + '/' +
                    self.selectedItem.SLOT_ID + '/' +
                    self.settings.rbcClassDirName + '/' +
                    self.settings.noMalariaDirName,
              endPoint: 'images'
            })
          ]).then(function(results) {
            console.log(results)
            // results[0] : malaria
            // results[1] : no malaria
            self.malariaList = []
            self.malariaList = results[0].data.results.filter(function(file) {
              return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
            })

            self.noMalariaList = []
            self.noMalariaList = results[1].data.results.filter(function(file) {
              return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
            })

            self.$initDrag()

          }).catch(function(err) {
            console.log(err)
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          })
        } catch (err) {
          self.$modal.show(ModalInfo, {item: err.message}, {
            height: 'auto',
            width: '550px'
          })
        }
      },
      zoom (evt) {
        var targetElement = null
        if (evt.target.querySelectorAll('img').length <= 0) {
          targetElement = evt.target.parentElement
        } else {
          targetElement = evt.target
        }

        if (evt.deltaY < 0) {
          var width = 0
          var images = targetElement.querySelectorAll('img')

          width = (images[0].offsetWidth + 1) + 'px'
          if ((images[0].offsetWidth + 1) < 192) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        } else {
          var width = 0
          var images = targetElement.querySelectorAll('img')

          width = (images[0].offsetWidth - 1) + 'px'
          if ((images[0].offsetWidth - 1) > 65) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        }
      }
    }
  }
</script>

<style>
</style>
