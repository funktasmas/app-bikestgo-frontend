import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Chart from 'react-apexcharts';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { format, register } from 'timeago.js';
import es from 'timeago.js/lib/lang/es';
import LoadingScreen from 'react-loading-screen';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';


register('es', es);

function dateFormatter(cell) {
  const datenew = format(new Date(cell * 1000), 'es');
  return (
    <span>{datenew}</span>
  );
}
const styles = {
  titulo: {
    textAlign: 'center',
    margin: '10 10',
  },
  subtitulo: {
    textAlign: 'center',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    padding: 50,
    backgroundColor: '#ff5e57',
    color: 'white',
    textAlign: 'center',
  }
};
const pagination = paginationFactory({
  sizePerPageList: [25, 50, 100, 150, 200]
});
const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;
const defaultSorted = [{
  dataField: 'name',
  order: 'asc'
}, {
  dataField: 'city',
  order: 'asc'
}];

const columns = [{
  dataField: 'name',
  text: 'Nombre',
  sort: true,
  filter: textFilter()
},
{
  dataField: 'city',
  text: 'Comuna',
  sort: true,
  filter: textFilter()
},
{
  dataField: 'last.free_bikes',
  text: 'Bicicletas Disponibles',
  sort: true,
  filter: numberFilter()
},
{
  dataField: 'last.empty_slots',
  text: 'Vacantes Libres',
  sort: true,
  filter: numberFilter()
},
{
  dataField: 'last.date_api',
  text: 'Actualización',
  sort: true,
  formatter: dateFormatter
}];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      stations: [],
      total_free_bikes: 0,
      total_empty_slots: 0,
      error: null,
      options_radial: {
        labels: ['Bicicletas Utilizadas'],
        colors: ["#20E647"],
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: "70%",
              background: "#293450"
            },
            track: {
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                blur: 4,
                opacity: 0.15
              }
            },
            dataLabels: {
              name: {
                offsetY: -10,
                color: "#fff",
                fontSize: "13px"
              },
              value: {
                color: "#fff",
                fontSize: "30px",
                show: true
              }
            }
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "vertical",
            gradientToColors: ["#87D4F9"],
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: "round"
        },
      },
      series_radial: [0],
      options_line: {
        chart: {
          stacked: false,
          zoom: {
            type: 'x',
            enabled: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        colors: ["#20E647"],
        stroke: {
          width: 7,
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#87D4F9'],
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
        markers: {
          colors: ["#293450"],
          strokeColor: "#fff",
          hover: {
            size: 7,
          }
        },
        yaxis: {
          title: {
            text: 'Bicicletas Utilizadas',
          },
        },
        xaxis: {
          type: 'datetime',
          title: {
            text: 'Tiempo',
          },
        }
      },
      series_line: [],
    }
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/api/store/stations/')
      .then(response => response.json())
      .then(data => this.setState({
        stations: data.stations,
        total_empty_slots: data.total_empty_slots,
        total_free_bikes: data.total_free_bikes,
        total_bike: data.total_free_bikes + data.total_empty_slots,
        series_radial: [((data.total_empty_slots * 100) / (data.total_free_bikes + data.total_empty_slots)).toFixed(2)],
        series_line: [{ data: data.chart_bike_used, name: "Bicicletas Disponibles" }],
        loading: false
      }))
      .catch(error => this.setState({ error, loading: false }));
  }

  render() {
    const { stations, error, series_radial, series_line, options_radial, options_line, total_empty_slots, total_free_bikes, total_bike, loading } = this.state;

    if (error) {
      return <h4 style={styles.error}>Error al obtener información.<br/>Intente en unos minutos más.</h4>;
    }
    return (
      <div>
        <LoadingScreen
          loading={loading}
          bgColor='#ff5900'
          spinnerColor='#ffffff'
          textColor='#ffffff'
          logoSrc='https://www.bikesantiago.cl/wp-content/themes/santiagotheme/images/santiago-logo.png'
          text='Espere unos segundos...'
          children={''}
        />
        <Grid fluid>
          <Row>
            <Col xs={12} md={6}>
              <h1 style={styles.titulo} className="m-5">Información Bike Stgo</h1>
              <ToolkitProvider
                keyField="id"
                data={stations}
                columns={columns}
                search
                exportCSV
                pagination
              >
                {
                  props => (
                    <div>
                      <SearchBar
                        {...props.searchProps}
                        placeholder="Buscar..."
                      />
                      <ClearSearchButton
                        {...props.searchProps}
                        className="btn btn-primary ml-1 mt-3 mb-4"
                      />
                      <ExportCSVButton
                        {...props.csvProps}
                        className="btn btn-success ml-2 mt-3 mb-4">
                        Exportar CSV</ExportCSVButton>
                      <BootstrapTable
                        {...props.baseProps}
                        bootstrap4
                        filter={filterFactory()}
                        defaultSorted={defaultSorted}
                        noDataIndication="-- Sin información --"
                        pagination={pagination}
                        striped
                        hover
                        condensed
                      />
                    </div>
                  )
                }
              </ToolkitProvider>
            </Col>
            <Col xs={12} md={6}>
              <h1 style={styles.titulo} className="m-5">Gráficos Bike Stgo</h1>
              <h4 style={styles.subtitulo}>% Total utilización de toda la red</h4>
              <h5 style={styles.subtitulo}>Bicicletas Utilizadas: {total_empty_slots}</h5>
              <h5 style={styles.subtitulo}>Bicicletas Disponibles: {total_free_bikes}</h5>
              <h5 style={styles.subtitulo}>Total Bicicletas: {total_bike}</h5>
              <Chart
                style={styles.box}
                options={options_radial}
                series={series_radial}
                type="radialBar"
                width="50%"
              />
              <h4 style={styles.subtitulo}>Linea de tiempo bicicletas utilizadas</h4>
              <Chart
                options={options_line}
                series={series_line}
                type="line"
                width="100%"
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;