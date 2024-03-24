
var fs = require('fs');
const ExifParser = require('exif-parser');
const express = require('express');
const app = express();
const PORT = 3000;
let cors= require('cors');
app.use(cors());



app.get('/marker-data', async (req, res) => {
    try {
        const markerData = await getAllMarkerData(req.user, req.query);
        if (markerData?.markerArray.length) {
            console.log("markerData fetched");
            res.status(200).json({ markerData });
        } else {
            console.log("No markerData Found");
            res.status(400).json({ error: "No markerData Found" });
        }
    } catch (error) {
        console.error("Error fetching markerData:", error); // Log any errors
        res.status(500).json({ error: error.message });
    }
});

// Function to extract EXIF data from a JPEG file
function extractExifData(filePath) {
    // Read the JPEG file
    const file = fs.readFileSync(filePath);

    // Parse EXIF data
    const parser = ExifParser.create(file);
    const result = parser.parse();

    return result.tags;
}

// Example usage
function getAllMarkerData(){
    return new Promise((resolve, reject)=>{
        try {
            let markerArray=[];
            let markerList=[]
            fs.readdirSync('./images').forEach(file => {
                  const jpegFilePath = `./images/${file}`;
                const exifData = extractExifData(jpegFilePath);
                console.log({filename: file, GPSLongitude: exifData.GPSLongitude, GPSLatitude: exifData.GPSLatitude});
                markerArray.push({
                    type: 'Feature',
                        properties: {
                            description:
                            `<img src="${jpegFilePath}" alt="Girl in a jacket" width="200" height="120">`,
                            onClick:`${jpegFilePath}`
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [exifData.GPSLongitude, exifData.GPSLatitude]
                        }
                    });
                    markerList.push(file);
              });
              resolve({markerArray, markerList});
              return;
        } catch (error) {
            reject(error);
            return;
        }
    })
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 