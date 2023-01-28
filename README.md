# File remover application
Application moves files to the specified thrash directory one of following ways:
* after the specified file
* after the specified file
* between the 2 specified files
* revert all deleted files back to the default directory

## Between the 2 specified files
`node index.js delete between myfile0200.txt myfile0202.txt`

## Before the specified file 
`node index.js delete before myfile0202.txt`

## After the specified file
`node index.js delete after myfile0202.txt`

## Revert all deleted files back to the default directory
`node index.js revert`