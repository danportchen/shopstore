<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" v-on:click="openModel(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <th width="100">分類</th>
        <th>產品名稱</th>
        <th width="100">原價</th>
        <th width="100">售價</th>
        <th width="100">是否啟用</th>
        <th width="100">編輯</th>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.origin_price }}</td>
          <td class="text-right">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModel(false, item)">編輯</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 老師模板 -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <!-- <i class="fas fa-spinner fa-spin"></i> -->
                    <div class="spinner" v-if="isspinner"></div>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
                </div>
                <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">ㄑ
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" v-model="tempProduct.category" placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price" placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" v-model="tempProduct.price" placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- 是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。 -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data () {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      isspinner: false
    }
  },
  methods: {
    getProducts () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${
        process.env.VUE_APP_CUSTOMPATH
      }/products?page=:page`
      const vm = this
      console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
      vm.isLoading = true
      this.$http.get(api).then(response => {
        console.log(response.data)
        vm.isLoading = false
        vm.products = response.data.products
      })
    },
    openModel (isNew, item) {
      if (isNew) {
        this.tempProduct = {}
        this.isNew = true
      } else {
        this.tempProduct = Object.assign({}, item)
        this.isNew = false
      }
      $('#productModal').modal('show')
    },
    updateProduct () {
      let api = `${process.env.VUE_APP_APIPATH}/api/${
        process.env.VUE_APP_CUSTOMPATH}/admin/product`
      let httpMethod = 'post'
      const vm = this
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
        httpMethod = 'put'
      }
      console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
      // 跨域请求
      // this.$http.xhr = { withCredentials: true }
      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        console.log(response.data)
        if (response.data.success) {
          $('#productModal').modal('hide')
          vm.getProducts()
        } else {
          $('#productModal').modal('hide')
          vm.getProducts()
          console.log('新增失敗')
        }
        // vm.products = response.data.proucts
        // this.products = response.data.products;
      })
    },
    uploadFile () {
      console.log(this)
      const uploadedFile = this.$refs.files.files[0]
      const vm = this
      const formData = new FormData()
      formData.append('file-to-upload', uploadedFile)
      const url = `${process.env.VUE_APP_APIPATH}/api/${
        process.env.VUE_APP_CUSTOMPATH}/admin/upload`
      vm.isspinner = true
      this.$http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log(response.data)
        vm.isspinner = false
        if (response.data.success) {
          // vm.tempProduct.imageUrl = response.data.imageUrl
          // console.log(vm.tempProduct)
          vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
        }
      })
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
<style scoped>
.spinner {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  position: relative;
  display: inline-block;
  top: 3px;
  border: 3px solid #ccc;
  border-top-color: cornflowerblue;
  border-bottom-color: cornflowerblue;
  animation: myspinny 2s linear infinite;
}
@keyframes myspinny {
  form {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
