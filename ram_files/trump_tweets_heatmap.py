import pandas as pd
import plotly.express as px


class TrumpHeatMap:
    def __init__(self, file_path, start_date=None, end_date=None):
        self.file_path = file_path
        self.start_date = start_date
        self.end_date = end_date
        self.df = pd.read_csv(file_path)

    def _filter_data(self):
        # Convert 'date' column to datetime if not already
        if not pd.api.types.is_datetime64_any_dtype(self.df['date']):
            self.df['date'] = pd.to_datetime(self.df['date'], errors='coerce')

        # Set default values for start_date and end_date if not provided
        if not self.start_date:
            self.start_date = self.df['date'].min()

        if not self.end_date:
            self.end_date = self.df['date'].max()

        # Convert start_date and end_date to datetime objects for comparison
        self.start_date = pd.to_datetime(self.start_date)
        self.end_date = pd.to_datetime(self.end_date)

        # Filter the DataFrame for the specified date range
        self.df = self.df.loc[(self.df['date'] >= self.start_date) & (self.df['date'] <= self.end_date)]

    def generate_heatmap(self, num_categories=10):
        # Load the CSV data
        self._filter_data()
        filtered_data = self.df
        # Get the top N categories with the highest number of tweets
        top_categories = filtered_data['category'].value_counts().nlargest(num_categories).index

        # Filter the DataFrame to include only the top N categories
        df_top_categories = filtered_data[filtered_data['category'].isin(top_categories)]

        # Create a heatmap
        self.fig = px.imshow(df_top_categories.groupby(['date', 'category']).size().unstack(fill_value=0),
                             labels=dict(color='Number of Tweets'),
                             x=df_top_categories['category'].unique(),
                             y=df_top_categories['date'].unique(),
                             title=f"Heatmap of Top {num_categories} Categories from {self.start_date} to {self.end_date}",
                             color_continuous_scale='Viridis')

        # Show the heatmap
        self.fig.show()

    def return_heatmap_obj(self):
        return self.fig
