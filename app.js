//Storage Controller
const storageCtrl = (function(){
//public
return {
    storeItem: function(item){
          let items=[];
          //check
          if(localStorage.getItem('items')=== null){
              items = [];
              //push new items 
              items.push(item)
              //set ls
              localStorage.setItem('items',JSON.stringify(items))
          }else {
              //get what is already in ls 
              items = JSON.parse(localStorage.getItem('items'));
              //push new ones 
              items.push(item)
              //re set 
              localStorage.setItem('items',JSON.stringify(items))
          }
    },
    getItemFromStorage: function(){
     let items=[];
     if(localStorage.getItem('items')===null){
         items = [];

     }   else {
         items = JSON.parse(localStorage.getItem('items'))
     }
     return items ; 
    },
    deleteItemFromStorage:function(id){
        let items = JSON.parse(localStorage.getItem('items'))
        items.forEach(function(item,index){
            if(id===item.id){
                items.splice(index,1)
            }
        })
        localStorage.setItem('items',JSON.stringify(items))
    },
    clearItemsFromStorage: function(){
        localStorage.removeItem('items')
    },
    updateItemStorage: function(updatedItem){
     let items  = JSON.parse(localStorage.getItem('items'))
     items.forEach(function(item,index){
         if(updatedItem.id===item.id){
             items.splice(index,1,updatedItem)
         }
     })
     localStorage.setItem('items',JSON.stringify(items))
    }
}
})();
//item Controller
const ItemCtrl = (function(){
    //item Constructor
   const Item = function(id,name,calories){
    this.id = id ;
    this.name = name;
    this.calories = calories;
   }
   //data structure/ State 
   const data = {
       items:storageCtrl.getItemFromStorage(),
       currentItem:null,
       totalCalories:0 
      }
      return {
          getItems: function(){
              return data.items;
          },
          addItem: function(name,calories){
         //create id
         let ID;
         if(data.items.length>0){
             ID = data.items[data.items.length -1].id +1;
         }else {
             ID = 0 ;
         }
              //calories to numbers
         calories = parseInt(calories)
                //create a new item
                newItem =new Item(ID,name,calories) 

                data.items.push(newItem)
                return newItem
          },
          getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id===id){
                    found =item;
                }
            })
            return found
          },
          updateItem: function(name,calories){
                   calories = parseInt(calories)
                   let found = null;
                   data.items.forEach(function(item){
                       if(item.id===data.currentItem.id){
                           item.name =name 
                           item.calories = calories 
                           found = item 
                       }
                   })
                   return found 
          },
          setCurrentItem: function(item){
              data.currentItem = item
          },
          deleteItem: function(id){
              //get ids 
              const ids = data.items.map(function(item){
                  return item.id;
              })
              //get index
              const index = ids.indexOf(id)
              //remove item 
              data.items.splice(index,1)
          },
          clearAllItems: function(){
              data.items = []
          },
          getCurrentItem : function(){
              return data.currentItem;
          },
          getTotalCalories: function(){
              let total = 0 ;
              data.items.forEach(function(item){
                  total +=item.calories;
              })
              data.totalCalories=total;
              return data.totalCalories
          }
          ,
          logData: function(){
              return data
          }
      }
})()
//UI Controller
const UICtrl = (function(){
    const UISelector={
        
        itemList:'#item-list',
        addBtn:'.add-btn',
        listItem:'#item-list li',
        updateBtn: '.update-btn',
        deleteBtn:'.delete-btn',
        clearBtn : '.clear-btn',
        backBtn:'.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories'
    }
    //public methods
return {
populateItemList:function(items){
    let html="";
    items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i
        ></a>
      </li>`
    })

    //insert list items
    document.querySelector(UISelector.itemList).innerHTML = html ;
},
addListItem: function(item){
    //show list
    document.querySelector(UISelector.itemList).style.display = 'block'
    //create li item 
    const li = document.createElement('li');
    //add class
    li.className= 'collection-item';
    li.id = `item-${item.id}`;
    li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i
    ></a>`;
    document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li)
},
updateListItem: function(item){
let listItems = document.querySelectorAll(UISelector.listItem)
listItems1 = Array.from(listItems);
listItems1.forEach(function(listItem){
     const itemID = listItem.getAttribute('id');
     if(itemID === `item-${item.id}`){
      
         document.querySelector(`#${itemID}`).innerHTML = `
         <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
         <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i
         ></a>
         `
     }
})
}
,getItemInput: function(){
    return {
        name:document.querySelector(UISelector.itemNameInput).value,
        calories:document.querySelector(UISelector.itemCaloriesInput).value
    }
},
showTotalCalories:function(totalCal){
    document.querySelector(UISelector.totalCalories).textContent = totalCal
},
clearEditState: function(){
    UICtrl.clearInput()
    document.querySelector(UISelector.deleteBtn).style.display= 'none'
    document.querySelector(UISelector.backBtn).style.display= 'none'
    document.querySelector(UISelector.updateBtn).style.display= 'none'
    document.querySelector(UISelector.addBtn).style.display= 'inline'
},showEditState: function(){
     
    document.querySelector(UISelector.deleteBtn).style.display= 'inline-block'
    document.querySelector(UISelector.backBtn).style.display= 'inline-block'
    document.querySelector(UISelector.updateBtn).style.display= 'inline-block'
    document.querySelector(UISelector.addBtn).style.display= 'none'
},
addItemToForm: function(){
    document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
    document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    UICtrl.showEditState();
}
,
getSelectors: function(){
return UISelector;
},hideList: function(){
    document.querySelector(UISelector.itemList).style.display= 'none'
},
removeItems: function(){
    let listItems = document.querySelectorAll(UISelector.listItems)
    //turn this to array
   listItems = Array.from(listItems) 
   
  listItems.forEach(function(item){
     item.remove()
     })
},
deleteListItem: function(id){
    const itemID =`#item-${id}`;
    const item = document.querySelector(itemID)
    item.remove()

}
,
clearInput: function(){
    document.querySelector(UISelector.itemNameInput).value = '';
    document.querySelector(UISelector.itemCaloriesInput).value = '';
}
}
})()
//App Controller
const App = (function(ItemCtrl,storageCtrl,UICtrl){
    //load event listeners
    const loadEventListener = function(){
        //get UI selector
const UISelector = UICtrl.getSelectors()

//add item event
document.querySelector(UISelector.addBtn).addEventListener('click',itemAddSubmit);
//edit icon click event 
document.querySelector(UISelector.itemList).addEventListener('click',itemEditClick)
//item update
document.querySelector(UISelector.updateBtn).addEventListener('click',itemUpdateSubmit)
//delete button 
document.querySelector(UISelector.deleteBtn).addEventListener('click',itemDeleteSubmit)
//clear on back click 
document.querySelector(UISelector.backBtn).addEventListener('click',UICtrl.clearEditState)
//disable enter 
document.addEventListener('keypress',function(e){
    if(e.keyCode===13 || e.which ===13){
        e.preventDefault()
        return false 
    }
})
//clear btn 
document.querySelector(UISelector.clearBtn).addEventListener('click',clearAllItemsClick);
    }

   const itemAddSubmit = function(e){
       
     //get from input fom ui controller 
     const input = UICtrl.getItemInput()
     
       //check for names and calories
       if(input.name !== "" && input.calories !== ''){

        //add
        const newItem = ItemCtrl.addItem(input.name,input.calories)
        UICtrl.addListItem(newItem)
        //add total cal to ui
        const totalCalories = ItemCtrl.getTotalCalories()
       
        UICtrl.showTotalCalories(totalCalories)
        //store in local storage
        storageCtrl.storeItem(newItem)
      
        UICtrl.clearInput();
       }
       e.preventDefault() 
      
   }
   const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
       
        const listId = e.target.parentElement.parentElement.id
     
        listIdArr = listId.split('-');
        const id = parseInt(listIdArr[1])
        console.log(listIdArr)
        const itemToEdit = ItemCtrl.getItemById(id)
            
        ItemCtrl.setCurrentItem(itemToEdit)


        UICtrl.addItemToForm();
    }
}
const itemUpdateSubmit = function(e){
    //get input 
    const input = UICtrl.getItemInput();
    //Update item 
    const updateItem = ItemCtrl.updateItem(input.name,input.calories)
    e.preventDefault()
    //update UI
    UICtrl.updateListItem(updateItem)
    //calories total
    const totalCalories = ItemCtrl.getTotalCalories()
 
    UICtrl.showTotalCalories(totalCalories)
    storageCtrl.updateItemStorage(updateItem)
    UICtrl.clearEditState()
}
const itemDeleteSubmit = function(e){

    const currentItem = ItemCtrl.getCurrentItem()
    //delete from data structure 
    ItemCtrl.deleteItem(currentItem.id)
    //delete from ui 
    UICtrl.deleteListItem(currentItem.id)
    const totalCalories = ItemCtrl.getTotalCalories()
 
        UICtrl.showTotalCalories(totalCalories)

        storageCtrl.deleteItemFromStorage(currentItem.id)
    e.preventDefault()

}
//clear all items
const clearAllItemsClick= function(e){
     //delete from ui 
     UICtrl.removeItems()
    //delete all items from data structure
    
        ItemCtrl.clearAllItems()
        const totalCalories = ItemCtrl.getTotalCalories()
     
     
        UICtrl.showTotalCalories(totalCalories) 
       
       
       
         //clear
        storageCtrl.clearItemsFromStorage()
    UICtrl.hideList()
    
}
    //Public methods
return {
    init: function(){
        //clear edit state when initializing
         UICtrl.clearEditState();

        //Fetch items from data structure
        const items = ItemCtrl.getItems();
       if(items.length ===0){
           UICtrl.hideList()
       }else {
             //populate list with items
        UICtrl.populateItemList(items)
       
       }
     
       const totalCalories = ItemCtrl.getTotalCalories()
 
        UICtrl.showTotalCalories(totalCalories)
      
      
        //load event
        loadEventListener()
    }
}
})(ItemCtrl,storageCtrl,UICtrl)
//initialize App
App.init()
 