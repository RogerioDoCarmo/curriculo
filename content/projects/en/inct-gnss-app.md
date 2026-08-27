---
id: inct-gnss-app
title: INCT GNSS App
description: Android application for real-time collection and processing of raw GNSS data, generating RINEX files and Single Point Positioning (SPP) solutions
featured: true
mockData: false
date: 2021-06-01
technologies:
  - Java
  - Android SDK
  - GNSS/GPS
  - RINEX 3.04
  - Google Maps API
  - Least Squares Method (LSM)
  - SUPL Server
  - Geocoding
images:
  - /images/projects/inct-gnss-app.png
---

## Overview

Android application developed during master's research in Cartographic Sciences at UNESP. INCT-GNSS-APP is a complete scientific tool for collecting raw GNSS data, generating RINEX files and processing positioning in real time using the Single Point Positioning (SPP) method.

## Key Features

### Raw GNSS Data Collection

- Real-time collection of raw data from multiple GNSS constellations
- Generation of raw data files compatible with the GNSS Analysis App format
- Storage of observables from every available constellation and frequency
- Intuitive interface for monitoring collection in real time

### RINEX File Generation

- **Real-time generation** of RINEX observation files, version 3.04
- Inclusion of **pseudorange** and **carrier phase** observables on the L1 frequency
- Compliance with international standards for GNSS data exchange
- RINEX header filled in automatically with cartesian coordinates

### Real-Time Single Point Positioning (SPP)

The application implements the SPP method in real time with the following characteristics:

- **Common reception method** for computing pseudoranges
- **Adjustment by the Least Squares Method (LSM)**
- Use of pseudoranges on the GPS constellation's L1 frequency
- **Google Maps integration** for visualizing positions

#### Initial Reference Coordinate

- Automatic request for the device's last known location
- Use of Android API 23 to obtain the most accurate location available
- Sources: GNSS chipset, mobile network or WiFi
- Blue marker on the map with a radius equal to the horizontal accuracy
- Conversion to cartesian coordinates for use in the adjustment

#### Ephemeris Retrieval

- Automatic download of broadcast ephemerides over the Internet
- Use of **Google's SUPL server**
- Initial coordinate sent to the server to retrieve the ephemerides

### Advanced Settings

The application offers customizable settings for processing:

- **Minimum satellite elevation angle**
- **Ionospheric correction models** (optional)
- **Tropospheric correction models** (optional)
- Custom **reference coordinate** for processing
- **Weighting function** for the adjustment
- **Chi-squared test** for statistical validation

### Visualization and Results

- **Textual presentation** of the results for each processed epoch
- **Red marker** on Google Maps for every estimated position
- **Reverse geocoding** to obtain the address associated with each coordinate
- Real-time visualization of the processing

## Generated Files

Once processing finishes, INCT-GNSS-APP creates a **ZIP file** containing:

1. **Raw GNSS data** in the GNSS Analysis App format (text)
2. **RINEX observation file** version 3.04 for GPS (L1)
3. **SPP results** in CSV format
4. **Coordinates of the satellites** used in the SPP
5. **Adjustment residuals** from the LSM
6. **KML file** with coordinates for viewing in Google Earth
7. **SUPL ephemerides** used (binary)
8. **Settings** defined for the run (binary)
9. **Raw GNSS data** from every constellation and frequency (binary)

### CSV Results File

The generated CSV file contains:

**Header section** (lines starting with "#"):

- Ionospheric and tropospheric correction models applied
- Elevation mask used
- Weighting function of the adjustment
- Chi-squared test information

**Data section** (for each processed epoch):

- GPS time
- Number of satellites used and the list of satellites
- Geocentric cartesian coordinates (X, Y, Z) and standard deviations
- Geodetic coordinates (latitude, longitude, altitude) in WGS 84
- Receiver clock error (seconds and metres)
- A posteriori variance of the adjustment
- Chi-squared test result

## Sharing and Integration

- **Native sharing** of the ZIP file through the Android interface
- **Upload to a cloud database** (optional)
- File format compatible with post-processing tools
- Integration with scientific research workflows

## Scientific Application

- Developed as part of the [master's dissertation](http://hdl.handle.net/11449/243430) in Cartographic Sciences (UNESP)
- Tool for assessing the quality of GNSS measurements on Android smartphones
- Used in research on positioning with low-cost devices
- Basis for statistical analyses and validation of positioning algorithms
- Read more technical details in the [full dissertation](http://hdl.handle.net/11449/243430)

## Academic Impact

- Contributed to scientific publications on GNSS in smartphones
- Made data collection and processing easier for researchers
- Demonstrated the feasibility of scientific positioning with mobile devices
- Open-source tool for the academic community
