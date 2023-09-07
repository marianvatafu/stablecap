using {CapgeminiPOC.db as db} from '../db/data-model';

service CatalogService @(path : '/catalog')
{
    entity Sales
      as select * from db.Sales
      actions {
        action boost() returns Sales;
      }
    ;

    entity Foods @(cds.persistence: { update: true })
      as select * from db.Foods
	  ;
    entity Groovy @(cds.persistence: { update: true })
    as select * from db.Groovy
    ;
  };

  service DeleteService @(path: '/delete') {
  function deleteAllFoods() 
  returns String;
}

  service Fridge @(path: '/Fridge') {
  function msgFridge(param1: String) 
  returns String;
  function anothermsgFridge(param1: String,param2: String) 
  returns String;
}


