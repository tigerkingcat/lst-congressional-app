import { useEffect, useState, useRef } from "react";
import "./App.css";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Slider from "./components/Slider.jsx";
import Map from "./components/Map.jsx";
import Delete from "./components/Delete.jsx";

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const initialFeatures = {
    impervious: 50,
    Pv: 0,
    NDWI: 0,
    elev: 5000,
    climate_category_Arid_Cold: 0,
    climate_category_Arid_Hot: 1,
    climate_category_Mediterranean: 0,
    climate_category_Semi_Arid_Cold: 0,
    urban_rural_classification_U: 1,
    urban_rural_classification_nan: 0,
    Median_Household_Income: 100000,
    High_School_Diploma_25plus: 50,
    Unemployment: 50,
    Median_Housing_Value: 1000000,
    Median_Gross_Rent: 2000,
    Renter_Occupied_Housing_Units: 0.5,
    Total_Population: 2500,
    Median_Age: 50,
    Per_Capita_Income: 100000,
    Families_Below_Poverty: 250,
    year_centered: 7.5,
};

const initialHviData = {
    lst: 20,
    impervious: 50,
    Pv: 0,
    NDWI: 0,
    elev: 5000,
    climate_category_Arid_Cold: 0,
    climate_category_Arid_Hot: 1,
    climate_category_Mediterranean: 0,
    climate_category_Semi_Arid_Cold: 0,
    urban_rural_classification_U: 1,
    urban_rural_classification_nan: 0,
    Median_Household_Income: 100000,
    High_School_Diploma_25plus: 50,
    Unemployment: 50,
    Median_Housing_Value: 1000000,
    Median_Gross_Rent: 2000,
    Renter_Occupied_Housing_Units: 0.5,
    Total_Population: 2500,
    Median_Age: 50,
    Per_Capita_Income: 100000,
    Families_Below_Poverty: 50000,
    year_centered: 7.5,
};

function App() {
    const [msg, setMsg] = useState({ text: "Connecting…", color: "neutral" });
    const [lst, setLst] = useState(0);
    const [lstPred, setLstPred] = useState(0);
    const [index, setIndex] = useState(0);
    const [indexPred,  setIndexPred] = useState(0);
    const [level, setLevel] = useState(0);
    const [showSlider, setShowSlider] = useState(false);
    const [features, setFeatures] = useState(initialFeatures);
    const [hviData, setHviData] = useState(initialHviData);
    const [id, setId] = useState(null);
    const [activeTab, setActiveTab] = useState('environmental');
    const mapRef = useRef(null);

    const id_list = [
        19558, 3949, 4825, 19654, 4989, 23979, 8635, 3951, 14562, 3798, 9340, 3950, 8636,
        23977, 13718, 19567, 4991, 8608, 8607, 23811, 23853, 2243, 23808, 4824, 4964, 4990,
        8604, 8967, 8751, 2563, 4992, 3875, 19564, 4959, 8725, 8463, 4823, 23897, 23868,
        8605, 8734, 19666, 8137, 8496, 7961, 19665, 8772, 14559, 5001, 8638, 23871, 4979,
        8912, 8139, 24018, 3007, 14558, 8750, 19568, 9179, 8467, 9341, 4826, 9175, 9066,
        7942, 8937, 9742, 23802, 4827, 9303, 8775, 3760, 24186, 24179, 5021, 9187, 16376,
        23816, 5022, 5003, 5020, 16445, 24330, 19541, 2330, 2591, 9029, 7882, 7897, 8898,
        5023, 3759, 8277, 2592, 16081, 8279, 7611, 9015, 3539, 8278, 16446, 4965, 19560,
        8633, 16407, 19542, 5002, 2325, 6029, 2333, 16471, 4978, 16325, 3267, 8068, 16342,
        7404, 16220, 16377, 2546, 9302, 23841, 2329, 13769, 23859, 16164, 16166, 3940,
        8632, 4952, 7403, 8067, 9464, 19565, 16095, 7920, 7619, 3648, 3440, 13869, 2326,
        24291, 2245, 9199, 8602, 8069, 7922, 9462, 7402, 9068, 16092, 9000, 9335, 4995,
        8736, 9349, 2327, 9342, 24287, 19664, 16375, 8152, 16327, 8149, 16245, 8601, 8849,
        16299, 2274, 4955, 4962, 8472, 23931, 16094, 2751, 9016, 16319, 10071, 24329, 16486,
        16111, 2606, 5772, 7401, 16077, 9445, 7646, 16110, 9332, 8899, 8148, 8274, 2695,
        16326, 9350, 4837, 8074, 7607, 9461, 16049, 2667, 9192, 24218, 16406, 9333, 8070,
        9468, 4950, 24080, 3800, 2595, 8049, 7610, 16090, 16298, 2479, 8145, 16172, 16064,
        9887, 9027, 16408, 2745, 2275, 9348, 3538, 9839, 16088, 9002, 16362, 9339, 16411,
        16173, 9001, 2551, 19653, 2608, 16360, 3650, 16147, 8276, 8469, 9319, 8762, 16361,
        14807, 9013, 7889, 2471, 2272, 9347, 7899, 8023, 3647, 16222, 16296, 8771, 23877,
        8151, 2594, 19563, 16388, 16294, 4956, 4055, 9469, 2601, 3407, 23965, 4957, 2681,
        16444, 8600, 16291, 16048, 19651, 8073, 8050, 16400, 4993, 8782, 7661, 3757, 16086,
        7900, 16174, 23949, 9316, 9017, 16290, 16470, 2668, 8848, 2593, 14515, 2323, 4970,
        7658, 3649, 2624, 16389, 2562, 24297, 9314, 4983, 8275, 16075, 8938, 3439, 2560,
        2694, 9004, 2831, 16351, 2257, 8631, 2240, 2264, 9345, 4972, 2312, 16300, 16390,
        3404, 2685, 8630, 16240, 2313, 2671, 2577, 8147, 8140, 2829, 3542, 7660, 4091, 8036,
        2271, 2690, 9344, 16468, 7921, 4963, 16069, 24367, 16337, 7614, 16302, 8051, 10070,
        19640, 16104, 16421, 2602, 9196, 8909, 9336, 7370, 24135, 2259, 8470, 2581, 2832,
        23892, 2555, 2255, 7896, 2689, 7923, 16312, 4961, 24323, 16415, 4982, 16102, 16318,
        4986, 9190, 16067, 8850, 8828, 16349, 10695, 19492, 16322, 2682, 16310, 4980, 8022,
        8589, 16218, 9326, 2260, 4997, 16387, 16352, 2258, 2470, 16416, 19562, 16084, 9313,
        2683, 2753, 8910, 16242, 14809, 2331, 3406, 16418, 7919, 7713, 24025, 8146, 16412,
        8936, 16355, 24123, 16273, 19655, 2462, 8141, 2261, 9317, 3268, 4945, 16098, 4981,
        8781, 24165, 3269, 7954, 7953, 2669, 9059, 2582, 2757, 16398, 24046, 16482, 4839,
        19491, 23985, 9312, 16283, 7618, 19652, 24137, 2604, 7405, 8024, 2559, 13711, 16223,
        2693, 9337, 16062, 16447, 16085, 23926, 8563, 4987, 16442, 2251, 16309, 3799, 9200,
        7600, 9334, 8143, 7962, 2334, 8900, 2332, 2752, 7881, 2262, 8562, 2265, 14806, 9740,
        16267, 2549, 16286, 2575, 16293, 2603, 8025, 2590, 2198, 16264, 2256, 19559, 16161,
        9305, 16241, 2253, 8634, 2578, 16287, 2564, 8142, 4951, 2692, 2679, 16409, 7601,
        16096, 2464, 16262, 2550, 2314, 16217, 16170, 7598, 2316, 14804, 9191, 19656, 3266,
        2561, 2579, 9064, 14560, 2244, 7960, 2473, 19561, 2574, 3008, 16292, 2548, 8150,
        19650, 9065, 19543, 19540, 2455, 10151, 8774, 4954, 8716, 10222, 10696, 16160
    ];

    const handleDelete = () => {
        mapRef.current?.resetSelection();
        setShowSlider(false);
    };

    const getHviColor = (level) => {
        const colors = {
            0: '#0080ff', // blue
            1: '#40c9ff', // light blue
            2: '#ffa940', // orange
            3: '#ff7875', // light red
            4: '#ff4d4f'  // red
        };
        return colors[level] || '#666';
    };

    const environmentalSliders = [
        { name: "Impervious Surface Area (%)", key: "impervious", min: 0, max: 100, step: "0.01" },
        { name: "Proportional Vegetation", key: "Pv", min: -1, max: 1, step: "0.01" },
        { name: "Water Index", key: "NDWI", min: -1, max: 1, step: "0.01" },
        { name: "Elevation (m)", key: "elev", min: 0, max: 10000, step: "1" },
        { name: "Arid (Cold) Climate", key: "climate_category_Arid_Cold", min: 0, max: 1, step: "1" },
        { name: "Arid (Hot) Climate", key: "climate_category_Arid_Hot", min: 0, max: 1, step: "1" },
        { name: "Mediterranean Climate", key: "climate_category_Mediterranean", min: 0, max: 1, step: "1" },
        { name: "Semi-Arid (Cold) Climate", key: "climate_category_Semi_Arid_Cold", min: 0, max: 1, step: "1" },
        { name: "Urban Area", key: "urban_rural_classification_U", min: 0, max: 1, step: "1" },
        { name: "Rural Area", key: "urban_rural_classification_nan", min: 0, max: 1, step: "1" },
    ];

    const socioeconomicSliders = [
        { name: "Median Household Income ($)", key: "Median_Household_Income", min: 0, max: 200000, step: "1" },
        { name: "High School Graduates (25+) (#)", key: "High_School_Diploma_25plus", min: 0, max: 10000, step: "1" },
        { name: "Unemployed Persons (#)", key: "Unemployment", min: 0, max: 5000, step: "1" },
        { name: "Median Housing Value ($)", key: "Median_Housing_Value", min: 0, max: 2000000, step: "1" },
        { name: "Median Gross Rent ($)", key: "Median_Gross_Rent", min: 0, max: 4000, step: "0.1" },
        { name: "Renter Occupied Housing Units (#)", key: "Renter_Occupied_Housing_Units", min: 0, max: 1000, step: "1" },
        { name: "Total Population (#)", key: "Total_Population", min: 0, max: 5000, step: "1" },
        { name: "Median Age (#)", key: "Median_Age", min: 0, max: 100, step: "0.1" },
        { name: "Per Capita Income ($)", key: "Per_Capita_Income", min: 0, max: 200000, step: "0.1" },
        { name: "Families Below Poverty (#)", key: "Families_Below_Poverty", min: 0, max: 100000, step: "1" }
    ];

    useEffect(() => {
        fetch(`${API_URL}/api/hello`)
            .then((res) => {
                if (!res.ok) throw new Error();
                setMsg({ text: "Connected", color: "good" });
            })
            .catch(() => setMsg({ text: "Unable to connect", color: "bad" }));
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/api/predict-hvi`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hviData),
        })
            .then((res) => res.json())
            .then((data) => {
                setIndexPred(data.HVI);
                setLevel(data.level);
            })
            .catch(console.error);
    }, [hviData]);

    useEffect(() => {
        fetch(`${API_URL}/api/predict-lst`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(features),
        })
            .then((res) => res.json())
            .then((data) => {
                setLstPred(data.lst);
                setHviData({
                    ...features,   // copy all current feature values
                    lst: data.lst, // add or update lst
                });
            })
            .catch(console.error);
    }, [features]);

    useEffect(() => {
        console.log("Selected polygon ID:", id);
        if (id == null) return;

        setShowSlider(true);

        fetch(`${API_URL}/api/receive-data`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setLst(data.lst_celsius);
                setIndex(data.HVI_score);
                setLevel(data.HVI_level);

                setFeatures({
                    impervious: data.impervious,
                    Pv: data.pv,
                    NDWI: data.ndwi,
                    elev: data.elev,
                    climate_category_Arid_Cold: data.climate_category_Arid_Cold,
                    climate_category_Arid_Hot: data.climate_category_Arid_Hot,
                    climate_category_Mediterranean: data.climate_category_Mediterranean,
                    climate_category_Semi_Arid_Cold: data.climate_category_Semi_Arid_Cold,
                    urban_rural_classification_U: data.urban_rural_classification_U,
                    urban_rural_classification_nan: data.urban_rural_classification_nan,
                    Median_Household_Income: data.median_household_income,
                    High_School_Diploma_25plus: data.high_school_diploma_25plus,
                    Unemployment: data.unemployment,
                    Median_Housing_Value: data.median_housing_value,
                    Median_Gross_Rent: data.median_gross_rent,
                    Renter_Occupied_Housing_Units: data.renter_occupied_housing_units,
                    Total_Population: data.total_population,
                    Median_Age: data.median_age,
                    Per_Capita_Income: data.per_capita_income,
                    Families_Below_Poverty: data.families_below_poverty,
                    year_centered: data.year_centered,
                });

                setHviData({
                    lst: data.lst_celsius,
                    impervious: data.impervious,
                    Pv: data.pv,
                    NDWI: data.ndwi,
                    elev: data.elev,
                    climate_category_Arid_Cold: data.climate_category_Arid_Cold,
                    climate_category_Arid_Hot: data.climate_category_Arid_Hot,
                    climate_category_Mediterranean: data.climate_category_Mediterranean,
                    climate_category_Semi_Arid_Cold: data.climate_category_Semi_Arid_Cold,
                    urban_rural_classification_U: data.urban_rural_classification_U,
                    urban_rural_classification_nan: data.urban_rural_classification_nan,
                    Median_Household_Income: data.median_household_income,
                    High_School_Diploma_25plus: data.high_school_diploma_25plus,
                    Unemployment: data.unemployment,
                    Median_Housing_Value: data.median_housing_value,
                    Median_Gross_Rent: data.median_gross_rent,
                    Renter_Occupied_Housing_Units: data.renter_occupied_housing_units,
                    Total_Population: data.total_population,
                    Median_Age: data.median_age,
                    Per_Capita_Income: data.per_capita_income,
                    Families_Below_Poverty: data.families_below_poverty,
                    year_centered: data.year_centered,
                });
            })
            .catch((err) => {
                console.error("Fetch error:", err);
            });
    }, [id]);

    return (
        <>
            <Header msg={msg} />

            <div className="instructions">
                <p><strong>Instructions:</strong> Click on or search for any area of the map to start analyzing heat vulnerability data for that location.</p>
            </div>

            <div className="main-content">

                <div className="map-container" onClick={() => !showSlider && setShowSlider(true)}>
                    <Map idFn={setId} ref={mapRef} />
                </div>

                {showSlider && (
                    <div className="control-panel">
                        <div className="control-header">
                            <Delete handleDelete={handleDelete} />
                            
                            {id_list.includes(id) ? (
                                <div className="hvi-display">
                                    <div className="hvi-score">
                                        <span className="label">HVI (Heat Vulnerability Index) Score:</span>
                                        <span className="value">{parseFloat((index || 0).toFixed(3))}</span>
                                    </div>
                                    <div className="hvi-score">
                                        <span className="label">HVI Score (pred):</span>
                                        <span className="value">{parseFloat((indexPred || 0).toFixed(3))}</span>
                                    </div>
                                    <div className="hvi-level" style={{ backgroundColor: getHviColor(level) }}>
                                        <span className="label">HVI (Heat Vulnerability Index) Level:</span>
                                        <span className="value">{level}</span>
                                    </div>
                                    <div className="lst-display">
                                        <div className="lst-current">
                                            <span className="label">Current LST (Land Surface Temperature):</span>
                                            <span className="value">{parseFloat((lst || 0).toFixed(2))}°C</span>
                                        </div>
                                        <div className={`lst-predicted ${(lstPred || 0) - (lst || 0) >= 0 ? 'negative' : 'positive'}`}>
                                            <span className="label">Predicted Change:</span>
                                            <span className="value">
                                                {(lstPred || 0) - (lst || 0) >= 0 ? '+' : ''}{parseFloat(((lstPred || 0) - (lst || 0)).toFixed(2))}°C
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-data">
                                    <p>Unfortunately, we do not have data for this block group at this time. Please check back later.</p>
                                </div>
                            )}
                        </div>

                        {id_list.includes(id) && (
                            <div className="tabs-container">
                                <div className="tabs">
                                    <button 
                                        className={`tab ${activeTab === 'environmental' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('environmental')}
                                    >
                                        Environmental Factors
                                    </button>
                                    <button 
                                        className={`tab ${activeTab === 'socioeconomic' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('socioeconomic')}
                                    >
                                        Socioeconomic Factors
                                    </button>
                                </div>

                                <div className="tab-content">
                                    {activeTab === 'environmental' && (
                                        <div className="slider-grid">
                                            {environmentalSliders.map(slider => (
                                                <Slider
                                                    key={slider.key}
                                                    name={slider.name}
                                                    min={slider.min}
                                                    max={slider.max}
                                                    step={slider.step}
                                                    featureFn={setFeatures}
                                                    featureKey={slider.key}
                                                    feature={features}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === 'socioeconomic' && (
                                        <div className="slider-grid">
                                            {socioeconomicSliders.map(slider => (
                                                <Slider
                                                    key={slider.key}
                                                    name={slider.name}
                                                    min={slider.min}
                                                    max={slider.max}
                                                    step={slider.step}
                                                    featureFn={setFeatures}
                                                    featureKey={slider.key}
                                                    feature={features}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="hvi-explanation">
                    <h3>Heat Vulnerability Index (HVI) Levels</h3>
                    <div className="hvi-levels">
                        <div className="hvi-level-item" style={{ backgroundColor: '#0080ff' }}>
                            <span className="level-number">0</span>
                            <span className="level-text">Normal Vulnerability</span>
                        </div>
                        <div className="hvi-level-item" style={{ backgroundColor: '#40c9ff' }}>
                            <span className="level-number">1</span>
                            <span className="level-text">Elevated Vulnerability</span>
                        </div>
                        <div className="hvi-level-item" style={{ backgroundColor: '#ffa940' }}>
                            <span className="level-number">2</span>
                            <span className="level-text">Moderate Vulnerability</span>
                        </div>
                        <div className="hvi-level-item" style={{ backgroundColor: '#ff7875' }}>
                            <span className="level-number">3</span>
                            <span className="level-text">High Vulnerability</span>
                        </div>
                        <div className="hvi-level-item" style={{ backgroundColor: '#ff4d4f' }}>
                            <span className="level-number">4</span>
                            <span className="level-text">Extreme Vulnerability</span>
                        </div>
                    </div>
                    <p className="hvi-description">
                        The Heat Vulnerability Index combines environmental and socioeconomic factors to assess
                        how vulnerable different areas are to extreme heat events. Higher levels indicate greater
                        risk and need for heat mitigation strategies.
                    </p>
                </div>

            </div>

            <Footer />
        </>
    );
}

export default App;
