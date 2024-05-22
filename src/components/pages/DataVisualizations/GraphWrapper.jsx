import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;
const baseUrl = 'https://hrf-asylum-be-b.herokuapp.com/cases';

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }
  async function updateStateWithNewData(years, view, office, stateSettingCallback) {
    if (office === 'all' || !office) {
      try {
        //API call for fiscalSummary
        const fiscalResponse = await axios.get(`${baseUrl}/fiscalSummary`, {
          params: {
            from: years[0],
            to: years[1],
          },
        });
        console.log("fiscal", fiscalResponse);
        //API call for citizenshipSummary
        const citizenshipResponse = await axios.get(`${baseUrl}/citizenshipSummary`, {
          params: {
            from: years[0],
            to: years[1],
          },
        });
        console.log('cit', citizenshipResponse);
        //Extracting data from both endpoints responses
        const fiscalData = fiscalResponse.data;
        const citizenshipData = citizenshipResponse.data;

        //Adding a new key in fiscalData called citizenshipResults with data from citizenshipData
        fiscalData.citizenshipResults = citizenshipData;
        
        //Update state with newly called data in a form of an array
        stateSettingCallback(view, office, [fiscalData]);
      } catch(err) {
        console.error(err);
      }
    } else {
      try {
        //API call for fiscalSummary with office selected
        const fiscalResponse = await axios.get(`${baseUrl}/fiscalSummary`, {
          params: {
            from: years[0],
            to: years[1],
            office: office,
          },
        });
        console.log('fiscalOffice', fiscalResponse);
        //API call for citizenshipSummary
        const citizenshipResponse = await axios.get(`${baseUrl}/citizenshipSummary`, {
          params: {
            from: years[0],
            to: years[1],
          },
        });
        console.log('citOffice', citizenshipResponse);
        //Extracting data from both endpoints responses
        const fiscalData = fiscalResponse.data;
        const citizenshipData = citizenshipResponse.data;

        //Adding a new key in fiscalData called citizenshipResults with data from citizenshipData
        fiscalData.citizenshipResults = citizenshipData;
        
        //Update state with newly called data in a form of an array
        stateSettingCallback(view, office, [fiscalData]);
      } catch(err) {
        console.error(err);
      }
    }

  }
  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
