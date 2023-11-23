import random


class ChartsUtils(object):
    """ Class to hold utility methods """

    @staticmethod
    def export_plotly_chart_to_html(fig_obj, **kwargs):
        """ Exporting Plotly Figure to html for interactive loading in front end
        Args:
            fig_obj (object) : Plotly object for chart to be exported
            kwargs:
                 html_file_name (str): Name of html file for chart to be stored
        """

        try:
            html_file_name = kwargs.get("html_file_name", f"{random.randint(0, 10000000)}_plotly.html")
            fig_obj.write_html(f"../html_export_dir/{html_file_name}")
        except Exception as ex:
            print(f"Exception occured while exporting :{ex}")
