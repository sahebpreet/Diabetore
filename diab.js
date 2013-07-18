
$(document).ready(function() 
{	
		var db;
		var storeName="diab";
		//var indexedDB = (window.indexedDB || window.mozIndexedDB);
		$("#main").hide();
		var openDb=function()
		{
			var request=indexedDB.open("diabetore",2);
			request.onsuccess = function()
			{
				console.log("DB created succcessfully");
				db = request.result;
				console.log("openDB done!!");
				return db;
			};
        
			
			request.onerror=function(){
				alert("could not open db");
			};
			
			request.onupgradeneeded = function()
			{ 
				var db= request.onsuccess();
				
				console.log("openDB.onupgradeneeded function");
				var store = db.createObjectStore(storeName, {keyPath: 'date'});
				var dateIndex = store.createIndex("date", "date",{unique: true});
  
							
			};   
		};
		
		function getObjectStore(store_name,mode)
		{
			var tx=db.transaction(store_name,mode);
			return tx.objectStore(store_name);
		}
		
		function addItems(date,pre,post)
		{
			console.log("addition to db started");
			var obj={date:date,pre:pre,post:post};
			var store=getObjectStore(storeName,'readwrite');
			var req;
			try
			{
				req=store.add(obj);
			}catch(e)
			{
				if(e.name=='DataCloneError')
				alert("This engine doesn't know how to clone");
				throw(e);
			}
			req.onsuccess=function(evt)
			{
				alert("Addition successful");
				
			};
			req.onerror=function(evt)
			{
				alert("!Could not insert into DB");
			};
			
		}
		
		function getItems(date)
		{	
			console.log("retrieval started from db");
			var hdate=new Date();
			
			var store=getObjectStore(storeName,"readonly");
			var obj={date:date};
			var index=store.index("date");
			
			var request=index.get(date);
			request.onsuccess=function()
			{
				var matching=request.result;
				if(matching !== undefined)
				{
					//report(matching.pre,matching.post);
					alert("Pre: "+matching.pre+ " , Post: "+matching.post);
					
			  	}else
					alert("Match Not Found");
				   //report (null);
			};
		
		}
		
		function showAll()
		{
			var objectStore = db.transaction(storeName).objectStore(storeName);

			objectStore.openCursor().onsuccess = function(event)
			{
				var cursor = event.target.result;
				if (cursor) 
				{	$("#main").slideDown();
					console.log("Date " + cursor.value.date + "  Pre: " + cursor.value.pre +"  Post: " + cursor.value.post);
					var row= ( cursor.value.date + "  Pre: " + cursor.value.pre +"  Post: " + cursor.value.post);
					$('.records').append('<div class="row" style="border:1px solid white;border-radius:3rem;text-align:center">'+row+'</div>');
					cursor.continue();
				}
				else
				{
					alert("No more entries!");
				}
				$("#back").click(function(){
					$('#main').hide();
				});
				
			};
			
		}
		
		
		function clearObjectStore(store_name)
		{
			var store = getObjectStore(store_name, 'readwrite');
			var req = store.clear();
			req.onsuccess = function(evt)
			{
				alert("ObjectStore Cleared..");
			};
			req.onerror = function (evt)
			{
				alert("! Object Store could not be cleared...");
			};
		}
		
		
		
		 

		 $("#add").click(function(){
				
				console.log("addEventListeners called...");
				
				console.log("add...");
				var date=document.getElementById('date').value;
				var pre=document.getElementById('pre').value;
				var post=document.getElementById('post').value;
				
				if(!date)
				{
					alert("required field missing..");
					return;
				}
				addItems(date,pre,post);
		  
		  });
		  
		  $("#show").click(function(){
		  
			console.log("eventlistner called for retrieval..");
			console.log("retrieve");
			
			var date=new Date().toDateString();
			date = $('#date').val();
			
			if(!date)
				{
					alert("required field missing..");
					return;
				}
			getItems(date);
		  });
		  
		  $("#showAll").click(function()
		  {
			
				console.log("eventlistner called for showAll...");
							
				showAll();
			
		  });
		  
		  $("#delete").click(function()
		  {
		  
			console.log("eventlistner called for deleting..");
			
			var r=confirm("do you really want to clear everything..");
			
			if(r==true)
			{
				clearObjectStore(storeName);
			}
			else
			{
				return;
			}
			
		  });
		
        openDb();
        


});
    
        
