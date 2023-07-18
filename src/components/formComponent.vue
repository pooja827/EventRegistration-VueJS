<!-- forms-update,insert -->
<template>
    <div>
      
      
      <form v-if="show" @submit.prevent="submitForm" method="post">
        <h1>Event Form</h1>
        <div class="form-group">
          <label for="eventId">Event ID:</label>
          <input type="text" id="eventId"  v-model="eventsdetails.eventId" @input="checkEventId" class="input-field"/>
          <span v-if="this.eventsdetails.isDuplicateEventId">This event ID is already taken.</span>
        </div>
        <div class="form-group">
          <label for="eventCategoryId">Category ID:</label>
          <input type="text" id="eventCategoryId" v-model="eventsdetails.eventCategoryId" name="eventCategoryId" class="input-field"  @input="validateID" required>
          <span v-if="idError" class="error">{{ idError }}</span>
        </div>
        <div class="form-group">
          <label for="eventName">Event Name:</label>
          <input type="text" id="eventName" v-model="eventsdetails.eventName" name="eventName" @input="validateName" class="input-field" required>
          <span v-if="nameError" class="error">{{ nameError }}</span>
        </div>
        <div class="form-group">
          <label for="eventDescription">Event Description:</label>
          <input type="text" id="eventDescription" v-model="this.eventsdetails.eventDescription" name="eventDescription" class="input-field" required>
        </div>
        <div class="form-group">
          <label for="eventPlace">Event Place:</label>
          <input type="text" id="eventPlace" v-model="eventsdetails.eventPlace" name="eventPlace" @input="validatePlace" class="input-field">
          <span v-if="placeError" class="error">{{ placeError }}</span>
        </div>
        <div class="form-group">
          <label for="eventDate">Event Date:</label>
          <input type="date" id="eventDate" v-model="formattedDate" name="eventDate" class="input-field" required>
        </div>
        <div class="form-group">
          <label for="eventTime">Event Time:</label>
          <input type="time" id="eventTime" v-model="eventsdetails.eventTime" name="eventTime" class="input-field" step="1" required>
        </div>     
        <button type="submit" class="submit-button">{{ this.edit ?'Update' : 'Add' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {DateTime} from 'luxon';
  import moment from 'moment';
  export default {
    name: 'UserForm',
    data() {
      return {
        id:'',
        eventsdetails:{
          eventId:'',
          eventCategoryId: '',
          eventName:'',
          eventDescription:'',
          eventPlace:'',
          eventDate:'',
          eventTime:'',
          idError: '',
          nameError: '',
          placeError:'',
          formattedDate: '',
          isDuplicateEventId:'',
        },
        flag:'',
        edit:false,
        baseUrl:import.meta.env.VITE_BASE_URL,
        show: false,    
        
      };
    },
    computed: {
      hasErrors() {
        return (
          this.idError ||
          this.nameError||
          this.placeError 
        );
      }
    },
    created(){
      this.emitter.on("getId",(evt)=>{
        const getData=evt.eventContent;
        this.id = getData.id;
        this.show = getData.show;
        console.log(this.id);
        this.fetchEvent();
      });

      this.emitter.on("showForm",(evt)=>{
        this.show=evt.eventContent;
        console.log(this.show);
      });

    },
    methods: {
      checkEventId() {
       
      // Make an API request to the server to check if the eventId already exists
      // You can use Axios or other HTTP libraries for making the request
      // Example:
      axios.get(`${this.baseUrl}check/${this.eventsdetails.eventId}`)
        .then((response) => {

          this.eventsdetails.isDuplicateEventId = response.data.isDuplicate;
          console.log(this.eventsdetails.isDuplicateEventId)
        })
        .catch((error) => {
          console.error(error);
        });
    },
      validateID() {
  if (!/^[a-zA-Z0-9]+$/.test(this.eventsdetails.eventCategoryId)) {
    this.idError = 'ID should contain both alphabets and numbers.';
  } else {
    this.idError = '';
  }
},
validateName() {
  if (!/^[a-zA-Z]+$/.test(this.eventsdetails.eventName)) {
    this.nameError = 'Name can only contain alphabets.';
  } else {
    this.nameError = '';
  }
},
validatePlace() {
  if (!/^[a-zA-Z]+$/.test(this.eventsdetails.eventPlace)) {
    this.placeError = 'Place should contain only alphabets.';
  } else {
    this.placeError = '';
  }
},

      submitForm() {
        const formattedDate = DateTime.fromISO(this.eventsdetails.eventDate).toFormat('yyyy-MM-dd');
        this.eventsdetails.eventDate = moment(this.formattedDate).format('YYYY-MM-DD');

        if(this.edit){
           this.updateEvent(this.id);
            this.resetForm();
            this.show = false;
            this.emitter.emit('reload',{'eventContent': this.show});
          }
          else{
         axios.post(`${this.baseUrl}insertevent`, this.eventsdetails)
          .then(response => {
            console.log(response.data);
            this.show = false;
            this.emitter.emit('reload',{'eventContent':this.show});
            alert(response.data) 
          })
          
          .catch(error => {
            console.error('Error while inserting data:', error);
          });
          this.resetForm();   
          
      }
            this.resetForm();
            this.show = false;
    },
    updateEvent(item) {
  if (window.confirm('Are you sure you want to update this event?')) {
    axios
      .put(`${this.baseUrl}updationevent/${this.id}`, this.eventsdetails)
      .then((response) => {
        console.log(response);
        this.resetForm();
        
        // Reset the form after successful update
        this.show = false;
        this.emitter.emit('reload', { 'eventContent': this.show });
        this.updateSuccess = true; // Set updateSuccess to true
        alert("Updation Successfull");
      })
      .catch((error) => console.error(error));
  } else {
    alert("Updation Cancelled");
  }
},

      resetForm() {
            this.eventsdetails.eventId = '';
            this.eventsdetails.eventCategoryId = '';
            this.eventsdetails.eventName = '';
            this.eventsdetails.eventDescription = '';
            this.eventsdetails.eventPlace = '';
            this.eventsdetails.eventDate='';
            this.eventsdetails.eventTime='';
            this.idError = '';
            this.nameError = ''; 
            this.placeError=''; 
            this.edit=false;
      },
      fetchEvent() {
  axios
    .get(`${this.baseUrl}selectedevent/${this.id}`)
    .then((response) => {
      this.edit = true;
      const details = response.data;

      this.eventsdetails = {
        eventId: details.event_id,
        eventCategoryId: details.event_category_id,
        eventName: details.event_name,
        eventDescription: details.event_description,
        eventPlace: details.event_place,
        eventDate: details.event_date,
        eventTime: details.event_time,
      };
      this.formattedDate = moment(this.eventsdetails.eventDate).format('YYYY-MM-DD');

      console.log(response.data);
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
    