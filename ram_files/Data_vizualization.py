import pandas
from testing_files import trump_classification
from trump_tweets_snakey import TrumpTweetsSankey
from trump_tweets_heatmap import TrumpHeatMap


class DataVisualization(object):
    """ Class for data visualisation methods and utilities for usage """

    def __init__(self):
        """ Load trump tweets data """
        self.csv_obj = pandas
        self.insult_tweets = self.csv_obj.read_csv("trump_tweets_data/trump_tweets_with_categories.csv")
        self.trump_all_tweets = self.csv_obj.read_csv("trump_tweets_data/realdonaldtrump.csv")
        self.insult_tweets_with_catagories = self.csv_obj.read_csv(
            "trump_tweets_data/trump_insult_tweets_with_catagories.csv")
        self.insult_catagory_csv_file = "trump_tweets_data/trump_insult_tweets_with_catagories.csv"
        self.trump_classification = trump_classification.trump_classification

    def sankey_graph(self, **kwargs):
        """ Task2 generate sankey diagram to represent trump insults and his tweets categories
            Args:
                kwargs: Keyword arguments
                 start_date (str) : Starting date for analysis
                 end_date (str) :end date for analysis
                 num_catagories (int): Number of categories to analyse
                 targets (int) : Number of targets for each category
        """

        trump_snakey = TrumpTweetsSankey(self.insult_catagory_csv_file, start_date=kwargs.get('start_date'),
                                         end_date=kwargs.get("end_date"))
        trump_snakey.create_sankey_chart(n_top_categories=kwargs.get("num_catagories", 10),
                                         n_top_targets=kwargs.get("targets", 3))
        return trump_snakey.get_chart_data()

    def generate_heatmap_for_trump_insults(self, **kwargs):
        """ Task3 generate HeatMap diagram to represent trump insults and his tweets categories
            Args:
                kwargs: Keyword arguments
                 start_date (str) : Starting date for analysis
                 end_date (str) :end date for analysis
                 num_catagories (int): Number of categories to analyse
        """

        heat_map_obj = TrumpHeatMap(self.insult_catagory_csv_file, start_date=kwargs.get('start_date'),
                                    end_date=kwargs.get("end_date"))
        heat_map_obj.generate_heatmap(kwargs.get("num_catagories", 10))
        return heat_map_obj.return_heatmap_obj()

    def build_new_csv_with_categories(self):
        self.insult_tweets['category'] = self.insult_tweets['target'].map(self.trump_classification)
        default_category = 'Unknown'
        self.insult_tweets['category'] = self.insult_tweets['category'].fillna(default_category)
        output_file_path = 'testing_files/trump_tweets_with_categories.csv'
        self.insult_tweets.to_csv(output_file_path, index=False)

        # Replace 'your_file.csv' with the actual file path

        # Read the CSV file
        def safe_eval(value):
            try:
                return eval(value)
            except Exception as e:
                print(f"Error evaluating value: {value}, Error: {e}")
                return None

        df = self.insult_tweets
        # Apply safe_eval to handle errors during evaluation
        df['category'] = df['category'].apply(safe_eval)

        # Filter out rows where evaluation failed
        df = df.dropna(subset=['category'])

        # Explode the 'category' column
        df_exploded = df.explode('category')

        # Display the exploded DataFrame
        print(df_exploded)

        # Save the exploded DataFrame to a new CSV file if needed
        df_exploded.to_csv('final_trump_tweets.csv', index=False)
