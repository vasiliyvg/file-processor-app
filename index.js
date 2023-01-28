import * as fs from 'fs';
import * as path from 'path';
import {config} from './config.js';

/**
 * This function is used to recursively fetch all the files in the given directory.
 * It will return an array containing the path of each file.
 */
function getAllFiles(dirName)
{
    let result = [];
    const files = fs.readdirSync(dirName);
    files.forEach(file =>
    {
        const filePath = path.join(dirName, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory())
        {
            result = result.concat(getAllFiles(filePath));
        } else
        {
            result.push(filePath);
        }
    });
    return result;
}

/**
 * This function is used to move a list of files either before or
 * after a certain file to the configured thrash directory.
 */
function moveToThrash(files, fileName, isBeforeFile)
{
    let deleteAfterIndex = 0;

    files.sort();
    if (isBeforeFile)
    {
        files.reverse();
    }

    files.forEach((file, index) =>
    {
        if (file === path.join(config.fileCleanUp.initDirName, fileName))
        {
            deleteAfterIndex = index;
            console.log(`Deleting all files ${isBeforeFile ? 'before' : 'after'} the file '${fileName}'...`);
        }
    });

    for (let i = deleteAfterIndex + 1; i < files.length; i++)
    {
        fs.rename(
            files[i],
            path.join(config.fileCleanUp.thrashDirName, path.basename(files[i])),
            function (err)
            {
                if (err) throw err;
            });
    }
    console.log(`Moved files to the thrash directory: 
        ${config.fileCleanUp.thrashDirName}`);
}

/**
 * This function is used to move a list of files between two specified files
 * to the configured thrash directory.
 */
function moveToThrashBetweenFiles(files, fileName1, fileName2)
{
    let deleteAfterIndex = 0;
    let deleteBeforeIndex = 0;

    files.sort();

    files.forEach((file, index) =>
    {
        if (file === path.join(config.fileCleanUp.initDirName, fileName1))
        {
            deleteAfterIndex = index;
            console.log(`Deleting all files between '${fileName1}'`);
        }
        if (file === path.join(config.fileCleanUp.initDirName, fileName2))
        {
            deleteBeforeIndex = index;
            console.log(`\t\t\tand '${fileName2}'...`);
        }
    });

    for (let i = deleteAfterIndex + 1; i < deleteBeforeIndex; i++)
    {
        fs.rename(
            files[i],
            path.join(config.fileCleanUp.thrashDirName, path.basename(files[i])),
            function (err)
            {
                if (err) throw err;
            });
    }
    console.log(`Moved files to the thrash directory: 
        ${config.fileCleanUp.thrashDirName}`);
}

/**
 * This function is used to move files from the thrash directory to the default directory.
 */
function revertFiles(files)
{
    files.forEach((file) =>
    {
        fs.rename(
            file,
            path.join(config.fileCleanUp.initDirName, path.basename(file)),
            function (err)
            {
                if (err) throw err;
            });
    });

    console.log(`Reverted ${files.length} files from the thrash directory  
        ${config.fileCleanUp.thrashDirName} 
        to 
        ${config.fileCleanUp.initDirName}`);
}

/**
 * Entry point for the application.
 */
function execute(config, operation)
{
    if (operation === 'revert')
    {
        let files = getAllFiles(config.fileCleanUp.thrashDirName);
        revertFiles(files);
    } else if (operation === 'delete')
    {
        let files = getAllFiles(config.fileCleanUp.initDirName);
        let isBefore = false;
        const filesParam = process.argv[3];
        if(filesParam === 'before')
        {
            isBefore = true;
        }
        else if(filesParam === 'after')
        {
            isBefore = false;
        }
        if(filesParam === 'between')
        {
            moveToThrashBetweenFiles(files, process.argv[4], process.argv[5])
        } else {
            moveToThrash(files, process.argv[4], isBefore);
        }
    }
}

execute(config, process.argv[2]);