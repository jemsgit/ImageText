# ImageText

CLI tool for generating image with title and description. It uses puppeteer for creating html markup and making screenshot.

## Usage

`npm start [title] [subtitle] [image number]`

## Options

The following options are available for using:

| Key | Description | Example |
| --- | --- | --- |
| `title` | Main title for image | `React Hooks` |
| `subtitle`| Subtitle with less forn size | `Usage of react hooks` |
| `image number`| Number of image that will be used as background (optional, if was not passed random image wil be used). There are images with sexual content starting from 55 number | `23` |

## Example

npm start "React hooks" "Usage of react hooks" 12

## Result

<img src="https://github.com/jemsgit/ImageText/blob/master/image.jpg" width="400">
