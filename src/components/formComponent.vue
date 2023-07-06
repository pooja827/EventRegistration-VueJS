<!-- forms-update,insert -->
<template>
    <div>
      
      <h1>Event Form</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="event_id">Event ID:</label>
          <input type="text" id="event_id" v-model="this.eventsdetails.event_id" name="event_id" class="input-field">
        </div>
        <div class="form-group">
          <label for="event_name">Event Name:</label>
          <input type="text" id="event_name" v-model="this.eventsdetails.event_name" name="event_name" class="input-field">
        </div>
        <div class="form-group">
          <label for="event_description">Event Description:</label>
          <input type="text" id="event_description" v-model="this.eventsdetails.event_description" name="event_description" class="input-field">
        </div>
        <div class="form-group">
          <label for="event_place">Event Place:</label>
          <input type="text" id="event_place" v-model="this.eventsdetails.event_place" name="event_place" class="input-field">
        </div>
        <div class="form-group">
          <label for="event_date">Event Date:</label>
          <input type="string" id="event_date" v-model="this.eventsdetails.event_date" name="event_date" class="input-field">
        </div>
        <div class="form-group">
          <label for="event_time">Event Time:</label>
          <input type="string" id="event_time" v-model.number="this.eventsdetails.event_time" name="event_time" class="input-field">
        </div>     
        <button type="submit" class="submit-button">{{ this.edit ?'Update' : 'Add' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    name: 'UserForm',
    data() {
      return {
        id:'',
        eventsdetails:{
          event_id: '',
          event_name:'',
          event_description:'',
          event_place:'',
          event_date:'',
          event_time:''
          
        },
        flag:'',
        edit:false,
        baseUrl:import.meta.env.VITE_BASE_URL,    
        
      };
    },
    created(){
      this.emitter.on("getId",(evt)=>{
        this.id=evt.eventContent;
        console.log(evt);
        this.fetchEvent();
      });

    },
    methods: {
      submitForm() {
        if(this.edit){
           this.updateEvent(this.id);
            this.resetForm();
            this.emitter.emit('reload',{'eventContent':'Reload'});
          }
          else{
        console.log(this.eventsdetails);
         axios.post('http://127.0.0.1:3333/insertevent', this.eventsdetails)
          .then(response => {
            console.log('Insertion successful');
            this.emitter.emit('reload',{'eventContent':'Reload'});
  
          })
          .catch(error => {
            console.error('Error inserting data:', error);
          });
          this.resetForm();
          this.emitter.emit('reload',{'eventContent':'Reload'});
      }
    },
      updateEvent(item) {
        axios
          .put(`${this.baseUrl}updationevent/${this.id}`, this.eventsdetails)
          .then((response) => {
            console.log(response);
            this.resetForm();
            
             // Reset the form after successful update
             
             this.emitter.emit('reload', { 'eventContent': 'Reload' });
            this.updateSuccess = true; // Set updateSuccess to true
           
          })
          .catch((error) => console.error(error));
      },
      resetForm() {
  
            this.eventsdetails.event_id = '';
            this.eventsdetails.event_name = '';
            this.eventsdetails.event_description = '';
            this.eventsdetails.event_place = '';
            this.eventsdetails.event_date='';
            this.eventsdetails.event_time='';
            this.edit=false;
      },
      fetchEvent() {
        axios
          .get(`${this.baseUrl}selectedevent/${this.id}`)
          .then((response) => {
            this.edit=true;
            this.eventsdetails = response.data;
          })
          .catch((error) => console.error(error));
      },
    },
  };
  
  </script>
    <style>
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .input-field {
      width: 300px;
      padding: 8px;
      font-size: 16px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    
    .submit-button {
      background-color: #699ec9;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .submit-button:hover {
      background-color: #75cc6e;
    }
    </style>
    