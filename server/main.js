import { Meteor } from 'meteor/meteor';  
import { setupApi } from '../imports/api/admin.js';  
import { setupApiCart } from '../imports/api/customer.js';  

Meteor.startup(() => {
   setupApi(); 
   setupApiCart(); 
});
