<!-- table-delete ,display,search -->
<template>
  <div v-if="show==false">
    <h1>Event Management Table</h1>
      <br>
      <br>
      <button  class='submit-button' @click="register">Event Registration</button>
      <br>
      <br>
      <br>
      <br>
      <h2>SEARCH FILTER</h2>
      <div id="search bar">
        <input type="text" class="input-field" v-model="searchQuery" placeholder="Search events by name, place,.." > 
        <br>
        <br>
        <button  class="submit-button" @click="searchDetails">Search</button> 
        <div id="message">{{ results }}</div>    
      </div>
      <br>
      <br>
      <div id="table"  v-if="show==false">
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
              <td>{{ item.event_category_id }}</td>
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
      <br>
      <br>
      <button class="submit-button" @click="downloadCSV">Download CSV</button>  
      
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
        show: false,
      };
    },
    mounted(){
      this.select();
    },
    created() {
      this.emitter.on("reload",(evt)=>{
        this.show=evt.eventContent;
        console.log(this.show);
        this.select();
      });
    },
    methods: {
            register(){
              this.show = true;
              this.emitter.emit('showForm', { 'eventContent': this.show });
            },
            select() {
            axios.get(`${this.baseUrl}selectevent`)
          .then(response => {
            this.eventdet = response.data;
            console.log(this.eventdet);
            this.headers = Object.keys(this.eventdet[0]).slice(0, 8);
            console.log(this.headers);
            this.flag = true;
          })
          .catch((error) => {
            console.error(error);
            this.flag = false;
          });
      },
      async deleteEvent(id) {
      if (window.confirm('Are you sure you want to delete this event?')) {
        try {
          const response = await axios.delete(`${this.baseUrl}Deletionevent/${id}`);
          console.log(response);
          this.select();
          // Display the alert message after successful deletion
          window.alert('Deletion successful');
        } catch (error) {
          console.error(error);
        }
      }
    },
      updateEvent(item) {
      console.log(this.emitter)
      this.show = true;
      const getItem = {
        id : item,
        show: this.show
      }
       this.emitter.emit('getId', { 'eventContent': getItem });
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
        downloadCSV() {
      axios({
        url: 'http://127.0.0.1:3333/download',
        method: 'GET',
        responseType: 'blob',
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'output.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error('Error downloading CSV file:', error);
        });
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
  