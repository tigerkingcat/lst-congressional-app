import { useEffect, useState, useRef } from "react";
import "./App.css";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Slider from "./Slider.jsx";
import Map from "./Map.jsx";
import Delete from "./Delete.jsx";

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
    Families_Below_Poverty: 50000,
    year_centered: 7.5,
};

function App() {
    const [msg, setMsg] = useState({ text: "Connecting…", color: "neutral" });
    const [lst, setLst] = useState(0);
    const [lstPred, setLstPred] = useState(0);
    const [showSlider, setShowSlider] = useState(false);
    const [features, setFeatures] = useState(initialFeatures);
    const [id, setId] = useState(null);
    const mapRef = useRef(null);

    const handleDelete = () => {
        mapRef.current?.resetSelection();
        setShowSlider(false)// call the method exposed by Map
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/hello")
            .then((res) => {
                if (!res.ok) throw new Error();
                setMsg({ text: "Connected", color: "good" });
            })
            .catch(() => setMsg({ text: "Unable to connect", color: "bad" }));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/api/predict-lst", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(features),
        })
            .then((res) => res.json())
            .then((data) => setLstPred(data.lst))
            .catch(console.error);
    }, [features]);

    useEffect(() => {
        if (id == null) return;
        fetch("http://localhost:8000/api/receive-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(id)   // send the ID in the request body
        })
    .then(res => {
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            return res.json();
        })
            .then(data => {
                // update the LST value
                setLst(data.lst_celsius);

                // seed the sliders with the values from the backend
                setFeatures({
                    impervious:                          data.impervious,
                    Pv:                                  data.pv,
                    NDWI:                                data.ndwi,
                    elev:                                data.elev,
                    climate_category_Arid_Cold:          data.climate_category_Arid_Cold,
                    climate_category_Arid_Hot:           data.climate_category_Arid_Hot,
                    climate_category_Mediterranean:      data.climate_category_Mediterranean,
                    climate_category_Semi_Arid_Cold:     data.climate_category_Semi_Arid_Cold,
                    urban_rural_classification_U:        data.urban_rural_classification_U,
                    urban_rural_classification_nan:      data.urban_rural_classification_nan,
                    Median_Household_Income:             data.median_household_income,
                    High_School_Diploma_25plus:          data.high_school_diploma_25plus,
                    Unemployment:                        data.unemployment,
                    Median_Housing_Value:                data.median_housing_value,
                    Median_Gross_Rent:                   data.median_gross_rent,
                    Renter_Occupied_Housing_Units:       data.renter_occupied_housing_units,
                    Total_Population:                    data.total_population,
                    Median_Age:                          data.median_age,
                    Per_Capita_Income:                   data.per_capita_income,
                    Families_Below_Poverty:              data.families_below_poverty,
                    year_centered:                       data.year_centered
                });
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });
    }, [id]);

    return (
        <>
            <Header />

            <p>Click to Start</p>

            <div className={`message ${msg.color}`}>
                <span>{msg.text}</span>
            </div>

            <div className="content">
                <div className="map-container" onClick={() => !showSlider && setShowSlider(true)}>
                    <Map idFn = {setId} ref={mapRef}/>
                </div>


                {showSlider && (
                    <div className="sidebar">
                        <Delete handleDelete={handleDelete} />
                        <div className="lst-values">
                            <h2>LST: {lst}</h2>
                            <h2>Predicted LST: {lstPred}</h2>
                        </div>
                        <div className="slider-section">
                            <Slider name="Impervious Surface Area" min={0} max={100} step='0.01' featureFn={setFeatures}
                                    featureKey="impervious" feature={features}/>
                            <Slider name="Proportional Vegetation" min={-1} max={1} step='0.01' featureFn={setFeatures}
                                    featureKey="Pv" feature={features}/>
                            <Slider name="Water Index" min={-1} max={1} step='0.01' featureFn={setFeatures}
                                    featureKey="NDWI" feature={features}/>
                            <Slider name="Elevation" min={0} max={10000} step='1' featureFn={setFeatures}
                                    featureKey="elev" feature={features}/>
                            <Slider name="Is the climate Arid (Cold)? 0 = no, 1 = yes" min={0} max={1} step='1' featureFn={setFeatures}
                                    featureKey="climate_category_Arid_Cold" feature={features}/>
                            <Slider name="Is the climate Arid (Hot)? 0 = no, 1 = yes" min={0} max={1} step='1' featureFn={setFeatures}
                                    featureKey="climate_category_Arid_Hot" feature={features}/>
                            <Slider name="Is the climate Mediterranean)? 0 = no, 1 = yes" min={0} max={1} step='1' featureFn={setFeatures}
                                    featureKey="climate_category_Mediterranean" feature={features}/>
                            <Slider name="Is the climate Semi-Arid (Cold)? 0 = no, 1 = yes" min={0} max={1} step='1'  featureFn={setFeatures}
                                    featureKey="climate_category_Semi_Arid_Cold" feature={features}/>
                            <Slider name="Is it an Urban Area 0 = no, 1 = yes" min={0} max={1} step='1' featureFn={setFeatures}
                                    featureKey="urban_rural_classification_U" feature={features}/>
                            <Slider name="Is it a rural area? 0 = no, 1 = yes" min={0} max={1} step='1' featureFn={setFeatures}
                                    featureKey="urban_rural_classification_nan" feature={features}/>
                            <Slider name="Median Household Income" min={0} max={200000} step='1' featureFn={setFeatures}
                                    featureKey="Median_Household_Income" feature={features}/>
                            <Slider name="Number with High School Diploma" min={0} max={10000} step='1' featureFn={setFeatures}
                                    featureKey="High_School_Diploma_25plus" feature={features}/>
                            <Slider name="Unemployed Persons" min={0} max={5000} step='1' featureFn={setFeatures}
                                    featureKey="Unemployment" feature={features}/>
                            <Slider name="Median Housing Value" min={0} max={2000000} step='1' featureFn={setFeatures}
                                    featureKey="Median_Housing_Value" feature={features}/>
                            <Slider name="Median Gross Rent" min={0} max={4000} step='0.1' featureFn={setFeatures}
                                    featureKey="Median_Gross_Rent" feature={features}/>
                            <Slider name="Renter Occupied Housing Units" min={0} max={1000} step='1' featureFn={setFeatures}
                                    featureKey="Renter_Occupied_Housing_Units" feature={features}/>
                            <Slider name="Total Population" min={0} max={5000} step='1' featureFn={setFeatures}
                                    featureKey="Total_Population" feature={features}/>
                            <Slider name="Median Age" min={0} max={100} step='0.1' featureFn={setFeatures}
                                    featureKey="Median_Age" feature={features}/>
                            <Slider name="Per Capita Income" min={0} max={200000} step='0.1' featureFn={setFeatures}
                                    featureKey="Per_Capita_Income" feature={features}/>
                            <Slider name="Families Below Poverty" min={0} max={100000} step='1' featureFn={setFeatures}
                                    featureKey="Families_Below_Poverty" feature={features}/>
                            <Slider name="Year (centered)" min={0} max={15} step='0.01' featureFn={setFeatures}
                                    featureKey="year_centered" feature={features}/>


                        </div>
                    </div>)

                }
            </div>

        <Footer />
    </>
  )
}

export default App
