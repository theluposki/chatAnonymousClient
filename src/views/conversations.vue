<script setup>
import { ref, onMounted } from "vue"
import { listCoversations } from "../mock/listCoversations.js"
  
const list = ref(listCoversations)

</script>

<template>
  <ul class="list">
    <li class="item" v-for="(item, i) in list" :key="item.id">
      <div class="wrapper-image">
        <img :src="'https://i.pravatar.cc/512?img='+i" class="image" alt="image" />
      </div>
      <div class="details">
        <span class="time">
          {{ item.createdAt }}
        </span>
        <h3>{{ item.nickname }}</h3>
        <span class="lastMessage">
          {{ item.lastMessage }}
        </span>
      </div>
    </li>
    <li class="end-list">fim da lista</li>
  </ul>
</template>

<style scoped>
  .list {
    position: relative;
    list-style: none;
    background-color: var(--dark);
    min-height: calc(100vh - 60px);
    max-height: calc(100vh - 60px);
    overflow-x: hidden;
    overflow-y: auto;
    
    padding-top: 8px;
    padding-bottom: 80px;
    
    display: flex;
    flex-flow: column;
    gap: 4px;
  }
  
  .end-list {
    text-align: center;
    color: #ddd;
  }
  
  .item {
    min-height: 80px;
    background-color: var(--dark2);
    
    display: flex;
    align-items: center;
    
    border-radius: 6px;
    box-shadow: inset 0 0 3px black;
    overflow: hidden;
    padding: 4px;
  }
  
  .item:active {
    scale: 0.95;
  }
  
  .wrapper-image {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
    margin-left: 4px;
  }
  
  .image {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .item h3 {
    flex: 1;
    min-width: 150px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    font-size: 22px;
  }
  
  
  .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 70px;
    max-height: 70px;
    overflow: hidden;
  }
  
  .lastMessage {
    height: 20px;
    
    display: flex;
    align-items: center;
    justify-content: flex-end;
    
    color: var(--white2);
    padding: 8px 14px;
    font-size: 14px;
  }
  
  .time {
    height: 20px;
    max-height: 20px;
    font-size: 12px;
    padding: 0 14px;
    
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #ddd;
  }
</style>
