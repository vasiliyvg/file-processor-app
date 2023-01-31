const archiver = require('archiver');
const fs = require('fs');

function archiveEachFolder()
{
    // define directory to archive
    const directoryPath = './';

// define output path for the archive
    const archivePath = './archive.zip';

// create the archive
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });

// pipe archive data to the file
    archive.pipe(output);

// Create list of all directories
    const listOfDirectories = (source) =>
        fs.readdirSync(source, {withFileTypes: true})
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

// Loop and add each directory to the archive
    const directories = listOfDirectories(directoryPath);
    directories.forEach(dir =>
    {
        archive.directory(`${directoryPath}/${dir}/`, `${dir}/`);
    });

// Finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize();
}

function unarhiveEachInFolder()
{
    const archiver = require('archiver');
    const fs = require('fs');

// define directory to unarchive
    const directoryPath = './';

// Create list of all archives
    const listOfArchives = (source) =>
        fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.name.endsWith('.zip'))
            .map(dirent => dirent.name);

// Loop and unarchive each archive
    const archives = listOfArchives(directoryPath);
    archives.forEach(archive => {
        const unarchivePath = `${directoryPath}/${archive.split('.zip')[0]}/`;
        const archivePath = `${directoryPath}/${archive}`;
        const extractor = archiver.createUnzip();
        const input = fs.createReadStream(archivePath);
        const output = fs.createWriteStream(unarchivePath);
        input.pipe(extractor).pipe(output);
    });
}