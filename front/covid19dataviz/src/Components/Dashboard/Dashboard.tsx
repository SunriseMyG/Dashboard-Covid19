import { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import { BarChart } from '@mui/x-charts/BarChart';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import TermsOfUse from '../TermsOfUse/TermsOfUse';

function getIconSize(confirmedCases: number): [number, number] {
    if (confirmedCases > 5000000) {
        return [15, 15];
    } else if (confirmedCases > 1000000) {
        return [10, 10];
    } else {
        return [5, 5];
    }
}

const createCustomIcon = (confirmedCases: number) => {
    return L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Redpoint.svg',
        iconSize: getIconSize(confirmedCases),
    });
};

interface Data {
    id: number;
    date: string;
    province: string;
    country: string;
    last_update: string;
    latitude: string;
    longitude: string;
    confirmed: number;
    deaths: number;
    recovered: number;
    active: number;
    combined_key: string;
    incident_rate: number;
    case_fatality_ratio: number;
}

interface DataLastMonth {
    country: string;
    combined_key: string;
    latitude: string;
    longitude: string;
    confirmed_max: number;
    confirmed_previous: number;
    confirmed_difference: number;
    deaths_max: number;
    deaths_previous: number;
    deaths_difference: number;
    recovered_max: number;
    recovered_previous: number;
    recovered_difference: number;
}

interface DailyData {
    date: string;
    confirmed: number;
    deaths: number;
    recovered: number;
}

function Dashboard() {
    const [data, setData] = useState<Data[]>([]);
    const [dataMonth, setDataMonth] = useState<DataLastMonth[]>([]);
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [mapData, setMapData] = useState<(Data | DataLastMonth)[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showMap, setShowMap] = useState<boolean>(true);
    const [selectedCountryData, setSelectedCountryData] = useState<{ confirmed: number; deaths: number; recovered: number } | null>(null); 
    const [selectedMonthData, setSelectedMonthData] = useState<{confirmed: number; deaths: number; recovered: number; } | null>(null);

    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lastDayResponse, dailyResponse, lastMonthResponse] = await Promise.all([
                    fetch('http://localhost:3000/api/lastday', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }),
                    fetch('http://localhost:3000/api/daily', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }),
                    fetch('http://localhost:3000/api/lastmonth', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                ]);

                if (!lastDayResponse.ok || !dailyResponse.ok || !lastMonthResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const [lastDayData, dailyData, lastMonthData] = await Promise.all([
                    lastDayResponse.json(),
                    dailyResponse.json(),
                    lastMonthResponse.json()
                ]);

                const formattedLastDayData = lastDayData.map((item: Data) => ({
                    id: item.id,
                    date: item.date,
                    province: item.province,
                    country: item.country,
                    last_update: item.last_update,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    confirmed: item.confirmed,
                    deaths: item.deaths,
                    recovered: item.recovered,
                    active: item.active,
                    combined_key: item.combined_key,
                    incident_rate: item.incident_rate,
                    case_fatality_ratio: item.case_fatality_ratio
                }));

                const formattedDailyData = dailyData.map((item: DailyData) => ({
                    date: item.date,
                    confirmed: item.confirmed,
                    deaths: item.deaths,
                    recovered: item.recovered
                }));

                const formattedLastMonthData = lastMonthData.map((item: DataLastMonth) => ({
                    country: item.country,
                    combined_key: item.combined_key,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    confirmed_max: item.confirmed_max,
                    confirmed_previous: item.confirmed_previous,
                    confirmed_difference: item.confirmed_difference,
                    deaths_max: item.deaths_max,
                    deaths_previous: item.deaths_previous,
                    deaths_difference: item.deaths_difference,
                    recovered_max: item.recovered_max,
                    recovered_previous: item.recovered_previous,
                    recovered_difference: item.recovered_difference
                }));

                setData(formattedLastDayData);
                setMapData(formattedLastDayData);
                setDailyData(formattedDailyData);
                setDataMonth(formattedLastMonthData);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        fetchData();
    }, []);

    // Concern Map
    const handle28DaysClick = () => {
        if (!showMap)
            setShowMap(true);
        setMapData(dataMonth);
    };

    const handleTotalClick = () => {
        if (!showMap)
            setShowMap(true);
        setMapData(data);
    };

    const handleTermsOfUseClick = () => {
        setShowMap(!showMap);
    }

    const groupedData = Object.values(
        mapData.reduce((acc, item) => {
            if (!acc[item.country]) {
                acc[item.country] = {
                    country: item.country,
                    confirmed: 0,
                    deaths: 0,
                    recovered: 0,
                    latitudes: [],
                    longitudes: [],
                };
            }

            if ('confirmed_difference' in item) {
                acc[item.country].confirmed += item.confirmed_difference;
                acc[item.country].deaths += item.deaths_difference;
                acc[item.country].recovered += item.recovered_difference;
            } else {
                acc[item.country].confirmed += item.confirmed;
                acc[item.country].deaths += item.deaths;
                acc[item.country].recovered += item.recovered;
            }

            const latitude = parseFloat(item.latitude);
            const longitude = parseFloat(item.longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                acc[item.country].latitudes.push(latitude);
                acc[item.country].longitudes.push(longitude);
            }

            return acc;
        }, {} as Record<string, { country: string; confirmed: number; deaths: number; recovered: number; latitudes: number[]; longitudes: number[] }>),
    );

    const dailyDifferences = dailyData.slice().reverse().map((current, index, array) => {
        if (index === 0) {
            return {
                date: current.date,
                confirmed_diff: current.confirmed,
                deaths_diff: current.deaths,
                recovered_diff: current.recovered
            };
        }

        const previous = array[index - 1];
        return {
            date: current.date,
            confirmed_diff: current.confirmed - previous.confirmed,
            deaths_diff: current.deaths - previous.deaths,
            recovered_diff: current.recovered - previous.recovered
        };
    });

    const centerMapOnCountry = (latitude: number, longitude: number) => {
        if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 5);
        }
    };

    const handleCountryClick = (
        countryData: { confirmed: number; deaths: number; recovered: number },
        latitudes: number[],
        longitudes: number[],
        country: string
    ) => {
        setSelectedCountryData(countryData);

        const monthData = dataMonth.reduce((acc, item) => {
            if (item.country === country) {
                acc.confirmed += item.confirmed_difference;
                acc.deaths += item.deaths_difference;
                acc.recovered += item.recovered_difference;
            }
            return acc;
        }, { confirmed: 0, deaths: 0, recovered: 0 });

        setSelectedMonthData(monthData);

        if (latitudes.length > 0 && longitudes.length > 0) {
            const avgLatitude = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
            const avgLongitude = longitudes.reduce((sum, long) => sum + long, 0) / longitudes.length;
            centerMapOnCountry(avgLatitude, avgLongitude);
        }
    };

    return (
        <div className="dashboard-container">
            <div className='dashboard'>
                <div className="dashboard-left-container">
                    <div className='dashboard-left-stat'>
                        <div className='dashboard-last-update'>
                            <p>JHU Ceased Updates at:</p>
                            <h4>
                                {data.length > 0 ? new Date(data[0].last_update).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }) : 'No Data Fetch'}
                            </h4>
                            <p>See Terms of Use for more info</p>
                        </div>
                        <div className='dashboard-total-cases'>
                            <p>Total Cases</p>
                            <h4>{selectedCountryData ? selectedCountryData.confirmed.toLocaleString('fr-FR') : (data.length > 0 ? data.reduce((acc, item) => acc + item.confirmed, 0).toLocaleString('fr-FR') : 'No Data Fetch')}</h4>
                        </div>
                        <div className='dashboard-total-deaths'>
                            <p>Total Deaths</p>
                            <h4>
                                {selectedCountryData ? selectedCountryData.deaths.toLocaleString('fr-FR') : (data.length > 0 ? data.reduce((acc, item) => acc + item.deaths, 0).toLocaleString('fr-FR') : 'No Data Fetch')}
                            </h4>
                        </div>
                        <div className='dashboard-total-vaccine'>
                            <p>Total Vaccine Doses Administered</p>
                            <h4>
                                {selectedCountryData ? selectedCountryData.recovered.toLocaleString('fr-FR') : (data.length > 0 ? data.reduce((acc, item) => acc + item.recovered, 0).toLocaleString('fr-FR') : 'No Data Fetch')}
                            </h4>
                        </div>
                    </div>
                    <div className='info-by-month'>
                        <div className='all-country-container'>
                            <div className='all-country'>
                                <div className='searchbar'>
                                    <input
                                        type='text'
                                        placeholder='Search Country'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                    />
                                </div>
                                {data.length > 0 ? (
                                    Object.values(
                                        data.reduce((acc, item) => {
                                            if (!acc[item.country]) {
                                                acc[item.country] = {
                                                    country: item.country,
                                                    confirmed: 0,
                                                    deaths: 0,
                                                    recovered: 0,
                                                };
                                            }
                                            acc[item.country].confirmed += item.confirmed;
                                            acc[item.country].deaths += item.deaths;
                                            acc[item.country].recovered += item.recovered;

                                            return acc;
                                        }, {} as Record<string, { country: string, confirmed: number, deaths: number, recovered: number }>))
                                        .filter(item => item.country.toLowerCase().includes(searchTerm))
                                        .sort((a, b) => b.confirmed - a.confirmed)
                                        .map((item, index) => {
                                            const lastMonthStats = dataMonth.reduce((acc, monthItem) => {
                                                if (monthItem.country === item.country) {
                                                    acc.confirmed += monthItem.confirmed_difference;
                                                    acc.deaths += monthItem.deaths_difference;
                                                }
                                                return acc;
                                            }, { confirmed: 0, deaths: 0 });

                                            return (
                                                <div key={index} className='each-country' onClick={() => {
                                                    const countryData = groupedData.find(g => g.country === item.country);
                                                    if (countryData && countryData.latitudes.length > 0 && countryData.longitudes.length > 0) {
                                                        const avgLatitude = countryData.latitudes.reduce((sum, lat) => sum + lat, 0) / countryData.latitudes.length;
                                                        const avgLongitude = countryData.longitudes.reduce((sum, long) => sum + long, 0) / countryData.longitudes.length;
                                                        centerMapOnCountry(avgLatitude, avgLongitude);
                                                    }
                                                    if (countryData) {
                                                        handleCountryClick({
                                                            confirmed: countryData.confirmed,
                                                            deaths: countryData.deaths,
                                                            recovered: countryData.recovered
                                                        }, countryData.latitudes, countryData.longitudes, countryData.country);
                                                    }
                                                }}>
                                                    <p>{item.country}</p>
                                                    <div className='each-country-mounth'>
                                                        <h4 className='title-each-country'>28-Day: </h4>
                                                        <h4 className='data-eact-country-data-first'>{lastMonthStats.confirmed ? lastMonthStats.confirmed.toLocaleString('fr-FR') : 'N/A'}</h4>
                                                        <h4 className='data-eact-country-data-second'> | </h4>
                                                        <h4 className='data-eact-country-data-second'>{lastMonthStats.deaths ? lastMonthStats.deaths.toLocaleString('fr-FR') : 'N/A'}</h4>
                                                    </div>
                                                    <div className='each-country-total'>
                                                        <h4 className='title-each-country'>Totals: </h4>
                                                        <h4 className='data-eact-country-data-first'>{item.confirmed ? item.confirmed.toLocaleString('fr-FR') : 'N/A'}</h4>
                                                        <h4 className='data-eact-country-data-second'> | </h4>
                                                        <h4 className='data-eact-country-data-second'>{item.deaths ? item.deaths.toLocaleString('fr-FR') : 'N/A'}</h4>
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <h4>No Data Fetch</h4>
                                )}
                            </div>
                            <div className='all-country-btn'>
                                <button>Admin 0</button>
                                <button>Admin 1</button>
                            </div>
                        </div>
                        <div className='month'>
                            <div className='last-mounth-container'>
                                <div className='month-case'>
                                    <p>28-Day Cases</p>
                                    <h4>
                                        {selectedMonthData && selectedMonthData.confirmed !== undefined ?
                                            selectedMonthData.confirmed.toLocaleString('fr-FR') :
                                            (dataMonth.length > 0 ?
                                                dataMonth.reduce((acc, item) => {
                                                    const confirmedDifference = item.confirmed_difference !== undefined ? item.confirmed_difference : 0;
                                                    return acc + confirmedDifference;
                                                }, 0).toLocaleString('fr-FR') :
                                                'No Data Fetch'
                                            )
                                        }
                                    </h4>
                                </div>
                                <div className='month-death'>
                                    <p>28-Day Deaths</p>
                                    <h4>
                                        {selectedMonthData && selectedMonthData.deaths !== undefined ?
                                            selectedMonthData.deaths.toLocaleString('fr-FR') :
                                            (dataMonth.length > 0 ?
                                                dataMonth.reduce((acc, item) => {
                                                    const deathsDifference = item.deaths_difference !== undefined ? item.deaths_difference : 0;
                                                    return acc + deathsDifference;
                                                }, 0).toLocaleString('fr-FR') :
                                                'No Data Fetch'
                                            )
                                        }
                                    </h4>
                                </div>
                                <div className='month-vaccine'>
                                    <p>28-Day Vaccine Doses Administered</p>
                                    <h4>
                                        {selectedMonthData && selectedMonthData.recovered !== undefined ?
                                            selectedMonthData.recovered.toLocaleString('fr-FR') :
                                            (dataMonth.length > 0 ?
                                                dataMonth.reduce((acc, item) => {
                                                    const recoveredDifference = item.recovered_difference !== undefined ? item.recovered_difference : 0;
                                                    return acc + recoveredDifference;
                                                }, 0).toLocaleString('fr-FR') :
                                                'No Data Fetch'
                                            )
                                        }
                                    </h4>
                                </div>
                            </div>
                            <div className='world-map-container'>
                                {showMap ? (
                                    <MapContainer
                                        center={[22.8566, 2.3522]}
                                        zoom={2}
                                        style={{ height: '100%', width: '95%', margin: '20px' }}
                                        ref={mapRef}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        {groupedData.map((item, index) => {
                                            if (item.latitudes.length === 0 || item.longitudes.length === 0) {
                                                return null;
                                            }
                                            const avgLatitude =
                                                item.latitudes.reduce((sum, lat) => sum + lat, 0) / item.latitudes.length;
                                            const avgLongitude =
                                                item.longitudes.reduce((sum, long) => sum + long, 0) / item.longitudes.length;

                                            return (
                                                <Marker
                                                    key={index}
                                                    position={[avgLatitude, avgLongitude]}
                                                    icon={createCustomIcon(item.confirmed)}
                                                >
                                                    <Popup>
                                                        <h4>{item.country}</h4>
                                                        <p>Confirmed: {item.confirmed}</p>
                                                        <p>Deaths: {item.deaths}</p>
                                                        <p>Recovered: {item.recovered}</p>
                                                    </Popup>
                                                </Marker>
                                            );
                                        })}
                                    </MapContainer>
                                ) : (
                                    <div className="terms-of-use">
                                        <TermsOfUse />
                                    </div>
                                )}
                            </div>
                            <div className='map-btn'>
                                <button onClick={handleTotalClick}>Total</button>
                                <button onClick={handle28DaysClick}>28-days</button>
                                <button onClick={handleTermsOfUseClick}>Terms of Use</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dashboard-right-container'>
                    <div className='right-container'>
                        <div className='graphic-container'>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: dailyDifferences.slice(1).map(item => new Date(item.date).toLocaleDateString('fr-FR')) }]}
                                series={[{ type: 'bar', data: dailyDifferences.slice(1).map(item => item.confirmed_diff ?? NaN) }]}
                                colors={['#f44336']}
                            />
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: dailyDifferences.slice(1).map(item => new Date(item.date).toLocaleDateString('fr-FR')) }]}
                                series={[{ type: 'bar', data: dailyDifferences.slice(1).map(item => item.deaths_diff ?? NaN) }]}
                                colors={['#ffffff']}
                            />
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: dailyDifferences.slice(1).map(item => new Date(item.date).toLocaleDateString('fr-FR')) }]}
                                series={[{ type: 'bar', data: dailyDifferences.slice(1).map(item => item.recovered_diff ?? NaN) }]}
                                colors={['#008000']}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;