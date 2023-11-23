import Data_vizualization as data_viz
from chart_utils import ChartsUtils as uti

if __name__ == '__main__':
    viz_obj = data_viz.DataVisualization()
    uti.export_plotly_chart_to_html(viz_obj.sankey_graph(), html_file_name="trump_snakey_chart.html")
    uti.export_plotly_chart_to_html(viz_obj.generate_heatmap_for_trump_insults(), html_file_name="trump_heat_map.html")