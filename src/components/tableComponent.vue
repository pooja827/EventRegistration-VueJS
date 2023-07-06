<!-- table-delete ,display,search -->
<template>
    <h1>Event Management Table</h1>
    <br>
      <h2>SEARCH FILTER</h2>
      <div id="search bar">
        <input type="text" class="input-field" v-model="searchQuery" placeholder="Search records.." > 
        <br>
        <br>
        <button  class="submit-button" @click="searchDetails">Search</button> 
        <div id="message">{{ results }}</div>    
      </div>
      <br>
      <br>
      <br>
      <div id="table" v-if="flag">
        <table>
          <thead>
            <tr>
              <th v-for="(key, index) in headers" :key="index">{{ key }}</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in eventdet" :key="index">
              <td>{{ item.id }}</td>
              <td>{{ item.event_id }}</td>
              <td>{{ item.event_name }}</td>
              <td>{{ item.event_description }}</td>
              <td>{{ item.event_place }}</td>
              <td>{{ item.event_date }}</td>
              <td>{{ item.event_time }}</td>
              <td><button @click="updateEvent(item.id)">Update</button></td>
              <td><button @click="deleteEvent(item.id)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    name: 'tableForm',
    data() {
      return {
        eventdet: [],
        flag: '',
        baseUrl: import.meta.env.VITE_BASE_URL,
        searchQuery: '',
        headers:null,
        results:'',
       
      };
    },
    created() {
     this.emitter.on('reload',this.select);
     this.select();
    },
    methods: {
   
            select() {
            axios.get(`${this.baseUrl}selectevent`)
          .then(response => {
            this.eventdet = response.data;
            console.log(this.eventdet);
            this.headers = Object.keys(this.eventdet[0]).slice(0, 7);
            console.log(this.headers);
            this.flag = true;
          })
          .catch((error) => {
            console.error(error);
            this.flag = false;
          });
      },
      deleteEvent(id) {
        axios
          .delete(`${this.baseUrl}Deletionevent/${id}`)
          .then((response) => {
            console.log(response);
            this.select();
          })
          .catch((error) => console.error(error));
      },
      updateEvent(item) {
      console.log(this.emitter)
       this.emitter.emit('getId', { 'eventContent': item });
        this.select()
      },
  
      searchDetails() {
    
          axios.get(`${this.baseUrl}searchevent/?search=${this.searchQuery}`)
          .then((response) => {
            console.log(response)
  
            this.eventdet=response.data;
            console.log(this.eventdet);
            if(this.eventdet.length == 0){
            this.results ="No Records Found"
          }
          })
                  .catch((error) => console.error(error));
  
  },
    },
  };
  </script>
  <style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 8px;
    border: 1px solid #e9f0ed;
  }
  
  th {
    background-color: #5cbb9f;
    font-weight: bold;
  }
  
  tr {
    background-color: #0e0d0d;
    color:rgb(248, 246, 246);
  }
  .input-field {
      width: 300px;
      padding: 8px;
      font-size: 16px;
      border-radius: 4px;
      border: 1px solid #88cfb4;
    }
  #dropdown {
    display: inline-block;
    position: relative;
  }
  
  
  select {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #131111;
    color: #eeeaea;
  }
  
  select:focus {
    outline: none;
    border-color: #5cbb9f;
  }
  
  /* Style the dropdown arrow */
  select::-ms-expand {
    display: none;
  }
  
  select::-webkit-select-placeholder {
    color: #999;
  }
  
  select::-moz-placeholder {
    color: #999;
  }
  
  select::-moz-placeholder {
    color: #999;
  }
  
  select::-ms-placeholder {
    color: #999;
  }
  </style>
  