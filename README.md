# Auto-Using for C#
Auto-imports and provides intellisense for references that were not yet imported in a C# file. 

![Sample](newdemo.gif)
  
  
  
  
  
  
  <br><br><br><br><br><br><br>
  
  
  
   
  
   
  
  
  
  
  
Gives priority to completions that were chosen before.

![Memory](memory.gif)



----


## Changelog

### 0.4.0 
- Completions no longer appear when typing a variable name 

If completions are appearing when they shouldn't, or not appearing when they should, please make an issue. 

### 0.3.3
- Increased the amount of references you can import from mscorelib (~900 references) to entire .NET base library (~3000 references).

If there is something missing from the base classes please make an issue.

### 0.2.3 
No more of that weird prefix stuff, completions that you have never chosen will be deprioitized but not prefixed. 

### 0.2.0
Removed unnecessary files

### 0.1.0
In an attempt to prevent this extension from cluttering Intellisense:
- Import completions you have chosen before will now get an highly increased priority
- Import completions you have never chosen will be prefixed (configurable) to highly reduce their priority.

### 0.0.3
Released
