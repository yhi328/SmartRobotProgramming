<template>
  <div class="header">
        <v-layout align-center>
            <div class="logo" @click="moveMain">Mjc Board</div>
            <v-spacer></v-spacer>
            <!-- 로그인한 상태면, 로그아웃 버튼이 생김-->
            <v-btn text v-if="$store.state.user" @click="logout">로그아웃</v-btn>
            <!-- 로그아웃한 상태면, 로그인 버튼이 생김-->
            <v-btn text v-if="!$store.state.user" @click="$router.push('/')"
            >로그인</v-btn>
            <!-- 로그인한 상태인지 아닌지를 나타냄 -->
            <div v-if="$store.state.user"> 
                {{ $store.state.user.name}}
            </div>
        </v-layout>
  </div>
</template>

<script>
export default {
    methods: {
        // 헤더의 Mjc Board 누르면 게시판(board) 페이지로 이동
        moveMain(){
            this.$router.push("/board");
        },
        // 헤더의 로그아웃 버튼 누르면 로그아웃
        logout() {
           this.axios.post("/api/users/logout").then((result) => {
               if(result.data.result == "ok"){
                   this.$store.commit("logout");
               }
           });  
        },
    },
    mounted() {
        this.axios.post("/api/users/info").then((result) => {
            if(result.data.result == "ok") {
                this.$store.commit("setUser", result.data.user);
            }
        });
    },
};
</script>

<style scoped>
   .header {
       padding: 10px 20px;
       box-shadow: 0 6px 6px #eee;
   }
   .header .logo {
       cursor: pointer;
   }
</style>