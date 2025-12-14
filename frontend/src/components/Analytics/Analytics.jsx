import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import projectStore from '../../stores/projectStore';
import './Analytics.css';

const Analytics = observer(() => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartRoot = useRef(null);
  const pieChartRoot = useRef(null);

  useEffect(() => {
    projectStore.fetchAnalytics();
  }, []);

  const { analytics, topProjects, isLoading } = projectStore;

  useLayoutEffect(() => {
    if (isLoading || topProjects.length === 0) return;

    if (barChartRoot.current) {
      barChartRoot.current.dispose();
    }

    const root = am5.Root.new(barChartRef.current);
    barChartRoot.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
        paddingLeft: 0,
        paddingRight: 20
      })
    );

    const data = topProjects.map((project, index) => ({
      category: project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title,
      fullTitle: project.title,
      value: project.likes_count || 0,
      author: project.username,
      rank: index + 1
    })).reverse();

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minGridDistance: 20
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    yAxis.get('renderer').labels.template.setAll({
      fontSize: 12,
      fill: am5.color(0x333333)
    });

    yAxis.data.setAll(data);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1
        }),
        min: 0
      })
    );

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Likes',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'value',
        categoryYField: 'category',
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'left',
          labelText: '{fullTitle}\nby {author}\n{valueX} likes'
        })
      })
    );

    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0
    });

    series.columns.template.adapters.add('fill', function (fill, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      if (barChartRoot.current) {
        barChartRoot.current.dispose();
        barChartRoot.current = null;
      }
    };
  }, [topProjects, isLoading]);

  useLayoutEffect(() => {
    if (isLoading || topProjects.length === 0) return;

    if (pieChartRoot.current) {
      pieChartRoot.current.dispose();
    }

    const root = am5.Root.new(pieChartRef.current);
    pieChartRoot.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    );

    const data = topProjects.slice(0, 5).map(project => ({
      category: project.title.length > 15 ? project.title.substring(0, 15) + '...' : project.title,
      fullTitle: project.title,
      value: project.reviews_count || 0,
      author: project.username
    }));

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        tooltip: am5.Tooltip.new(root, {
          labelText: '{fullTitle}\nby {author}\n{value} reviews'
        })
      })
    );

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff)
    });

    series.labels.template.setAll({
      fontSize: 11,
      text: '{category}',
      textType: 'circular'
    });

    series.data.setAll(data);
    series.appear(1000, 100);

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
      })
    );

    legend.data.setAll(series.dataItems);

    return () => {
      if (pieChartRoot.current) {
        pieChartRoot.current.dispose();
        pieChartRoot.current = null;
      }
    };
  }, [topProjects, isLoading]);

  if (isLoading) {
    return (
      <div className="analytics-page">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div className="header-content">
          <Link to="/" className="back-btn">← Back to Home</Link>
          <h1>Analytics</h1>
          <div></div>
        </div>
      </header>

      <div className="analytics-container">
        <div className="stats-overview">
          <h2>Platform Overview</h2>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>{analytics?.total_projects || 0}</h3>
              <p>Total Projects</p>
            </div>
            <div className="stat-card">
              <h3>{analytics?.total_likes || 0}</h3>
              <p>Total Likes</p>
            </div>
            <div className="stat-card">
              <h3>{analytics?.total_reviews || 0}</h3>
              <p>Total Reviews</p>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-container">
            <h2>Top Projects by Likes</h2>
            {topProjects.length === 0 ? (
              <p className="no-data">No projects yet</p>
            ) : (
              <div 
                ref={barChartRef} 
                className="amchart-container"
                style={{ width: '100%', height: '400px' }}
              />
            )}
          </div>

          <div className="chart-container">
            <h2>Reviews Distribution</h2>
            {topProjects.length === 0 ? (
              <p className="no-data">No projects yet</p>
            ) : (
              <div 
                ref={pieChartRef} 
                className="amchart-container"
                style={{ width: '100%', height: '350px' }}
              />
            )}
          </div>
        </div>

        <div className="top-reviewed-section">
          <h2>Detailed Project Statistics</h2>
          <div className="projects-table">
            <div className="table-header">
              <span>Rank</span>
              <span>Project</span>
              <span>Author</span>
              <span>Reviews</span>
              <span>Likes</span>
            </div>
            {topProjects
              .slice(0, 10)
              .map((project, index) => (
                <div key={project.id} className="table-row">
                  <span className="rank-cell">#{index + 1}</span>
                  <span className="project-cell">{project.title}</span>
                  <span className="author-cell">{project.username}</span>
                  <span className="reviews-cell">{project.reviews_count || 0}</span>
                  <span className="likes-cell">{project.likes_count || 0}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Analytics;
