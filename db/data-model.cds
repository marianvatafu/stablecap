
context CapgeminiPOC.db {

entity Sales {
  key ID          : Integer;
      region      : String(100);
      country     : String(100);
      org         : String(4);
      amount      : Integer;
      comments    : String(100);
      criticality : Integer;
};

entity Foods {
  key ID          : Integer;
      Name        : String(100);
      Quantity    : String(100);
      UOM         : String(100);
};

entity Groovy {
  key ID : Integer;
  Groovy : String(100);
  Quantity : String(100);
  UOM : String(100);
};

}
