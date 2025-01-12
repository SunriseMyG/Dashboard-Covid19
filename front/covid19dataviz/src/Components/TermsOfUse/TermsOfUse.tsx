import React from "react";
import './TermsOfUse.css';
import { start } from "repl";

function TermsOfUse() {
  return (
    <div className="text-fields" style={{textAlign: 'start'}}>
          <p><span style={{color: "red", fontWeight: "bold"}}>On March 10, 2023, the Johns Hopkins Coronavirus Resource Center will cease collecting and reporting of global COVID-19 data. </span>
            For updated cases, deaths, and vaccine data please visit the following sources:
          </p>
          <ul>
              <li>
                  <p>
                      Global: <a href="https://www.who.int/">World Health Organization (WHO)</a>
                  </p>
              </li>
              <li>
                  <p>
                      U.S.: <a href="https://www.cdc.gov/covid/index.html">U.S. Centers for Disease Control and Prevention (CDC)</a>
                  </p>
              </li>
          </ul>
          <p>
              For more information, visit the <a href="https://coronavirus.jhu.edu/">Johns Hopkins Coronavirus Resource Center.</a>
          </p>
          <p>
              Lancet Inf Dis Article: <a href="https://www.thelancet.com/journals/laninf/article/PIIS1473-3099(20)30120-1/fulltext">Here</a>. Mobile Version: <a href="https://www.arcgis.com/apps/dashboards/85320e2ea5424dfaaa75ae62e5c06e61">Here</a>. Data sources: <a href="https://github.com/CSSEGISandData/COVID-19/blob/master/README.md">Full list</a>. Downloadable database: <a href="https://github.com/CSSEGISandData/COVID-19">GitHub</a>, <a href="https://www.arcgis.com/home/item.html?id=c0b356e20b30490c8b8b4c7bb9554e7c">Feature Layer</a>.
          </p>
          <p>
              Led by <a href="https://systems.jhu.edu/">JHU CSSE</a>. Technical Support: <a href="https://livingatlas.arcgis.com/en/home/">Esri Living Atlas team</a> and <a href="https://www.jhuapl.edu/">JHU APL</a>. Financial Support: <a href="https://coronavirus.jhu.edu/map.html">JHU</a>, <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2028604">NSF</a>, <a href="https://www.bloomberg.org/">Bloomberg Philanthropies</a> and <a href="https://www.snf.org/">Stavros Niarchos Foundation</a>. Resource support: <a href="https://slack.com/intl/fr-fr/">Slack</a>, <a href="https://github.com/">Github</a> and <a href="https://aws.amazon.com/fr/">AWS</a>. Click <a href="https://engineering.jhu.edu/covid-19/">here</a> to donate to the CSSE dashboard team, and other JHU COVID-19 Research Efforts. <a href="https://systems.jhu.edu/research/public-health/2019-ncov-map-faqs/">FAQ</a>. Read more in this <a href="https://systems.jhu.edu/research/public-health/ncov/">blog</a>. <a href="mailto:jhusystems@gmail.com">Contact US</a>.
          </p>
          <p style={{textDecoration: "underline"}}>
              <strong>Useful links:</strong>
          </p>
          <ul>
              <li><a href="https://github.com/CSSEGISandData/COVID-19">Raw dataset for cases, deaths, and US testing data</a></li>
              <li><a href="https://github.com/govex/COVID-19/tree/master/data_tables/vaccine_data">Vaccine data from govex</a></li>
              <li><a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data#data-modification-records">Data modification records</a></li>
              <li><a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data#retrospective-reporting-of-probable-cases-and-deaths">Retrospective reporting of (probable) cases and deaths</a></li>
              <li><a href="https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data#large-scale-back-distributions">Large-scale back distributions</a></li>
              <li><a href="https://github.com/CSSEGISandData/COVID-19/issues">Irregular Update Schedules</a></li>
              <li><a href="https://github.com/CSSEGISandData/COVID-19/issues">Users forum</a></li>
          </ul>
          <p style={{textDecoration: "underline"}}>
              <strong>Definitions:</strong>
          </p>
          <ul>
              <li><strong>Cases</strong> and <strong>Death</strong> counts include confirmed and probable (where reported).</li>
              <li><strong>Incidence Rate</strong> = cases per 100,000 persons.</li>
              <li><strong>Case-Fatality Ratio</strong> (%) = Number recorded deaths / Number cases.</li>
              <li><strong>Point level</strong>: Admin2 Level (County) - US only; Admin1 Level (Province/State); Admin0 Level (Countries/Regions/Sovereignties). All points (except for Australia and Italy) shown on the map are based on geographic centroids, and are not representative of a specific address, building or any location at a spatial scale finer than a province/state. Australian and Italian dots are located at the centroid of the largest city in each state.</li>
              <li><strong>Time Zones</strong>: lower-left corner indicator - your local time; lower-right corner plot - UTC.</li>
          </ul>
          <p>
              Note: All cases of COVID-19 in repatriated US citizens from the Diamond Princess are grouped together. These individuals have been assigned to various quarantine locations (in military bases and hospitals) around the US. This grouping is consistent with the CDC.
          </p>
          <p>
              *The names of locations included on the Website correspond with the official designations used by the U.S. Department of State. The presentation of material therein does not imply the expression of any opinion whatsoever on the part of JHU concerning the legal status of any country, area or territory or of its authorities. The depiction and use of boundaries, geographic names and related data shown on maps and included in lists, tables, documents, and databases on this website are not warranted to be error free nor do they necessarily imply official endorsement or acceptance by JHU.
          </p>
          <p style={{textDecoration: "underline"}}>
              <strong>Terms of Use:</strong>
          </p>
          <ul>
              <li>This website and its contents herein, including all data, mapping, and analysis are copyright 2020 Johns Hopkins University, all rights reserved. When linking to the website, attribute the Website as the "COVID-19 Dashboard by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University"</li>
              <li>This data set underlying the map, provided on the CSSE GitHub (url: <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>), is licensed under the Creative Commons Attribution 4.0 International by the Johns Hopkins University on behalf of its Center for Systems Science in Engineering. Copyright Johns Hopkins University 2020. Attribute the data to the "COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University" or "JHU CSSE COVID-19 Data" for short, and the url: <a href="https://github.com/CSSEGISandData/COVID-19">https://github.com/CSSEGISandData/COVID-19</a>.</li>
              <li>For publications that use the data, please cite the following publication: "Dong E, Du H, Gardner L. An interactive web-based dashboard to track COVID-19 in real time. Lancet Inf Dis. 20(5):533-534. doi: 10.1016/S1473-3099(20)30120-1"</li>
          </ul>
          <p>
              Visit the <a href="https://coronavirus.jhu.edu/">Johns Hopkins Coronavirus Resource Center</a> where our experts help to advance understanding of the virus, inform the public, and brief policymakers in order to guide a response, improve care, and save lives.
          </p>
    </div>
  );
}

export default TermsOfUse;