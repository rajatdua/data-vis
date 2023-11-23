import pandas as pd
import plotly.graph_objects as go


class TrumpTweetsSankey:
    def __init__(self, csv_file, start_date=None, end_date=None):
        self.df = pd.read_csv(csv_file)
        self.num_categories = 0
        self.start_date = start_date
        self.end_date = end_date
        self.targets = []

    def create_sankey_chart(self, n_top_categories, n_top_targets):
        self.sanitize_data()
        self._get_metadata()
        top_categories = self._get_top_categories(n_top_categories)
        self._filter_top_categories(top_categories)
        self._get_top_targets_per_category(n_top_targets)
        self._create_sankey_diagram()
        self._add_hover_information()
        self._add_chart_title()
        self._show_plot()

    def sanitize_data(self):
        self.df = self.df.drop_duplicates(subset=self.df.columns.difference(['S.No']))
        if self.start_date:
            self.start_date = pd.to_datetime(self.start_date)
        if self.end_date:
            self.end_date = pd.to_datetime(self.end_date)

            # Filter the DataFrame for the specified date range
        if self.start_date and self.end_date:
            filtered_data = self.df.loc[
                (pd.to_datetime(self.df['date']) >= self.start_date) &
                (pd.to_datetime(self.df['date']) <= self.end_date)
                ]
        else:
            filtered_data = self.df

        self.df = filtered_data

    def _get_metadata(self):
        self.num_categories = self.df['category'].nunique()
        self.start_date = self.df['date'].min()
        self.end_date = self.df['date'].max()
        self.targets = self.df['target'].unique()

    def _get_top_categories(self, n):
        category_tweets = self.df['category'].value_counts()
        return category_tweets.nlargest(n).index

    def _filter_top_categories(self, top_categories):
        self.df_top_categories = self.df[self.df['category'].isin(top_categories)]

    def _get_top_targets_per_category(self, n):
        self.top_targets_per_category = (
            self.df_top_categories.groupby('category')['target']
            .value_counts().groupby(level=0, group_keys=False)
            .nlargest(n)
        )

    def _create_sankey_diagram(self):
        nodes = list(self.df_top_categories['category'].unique()) + list(
            self.top_targets_per_category.index.get_level_values(1).unique())
        links = []
        for category in self.df_top_categories['category'].unique():
            for target, value in self.top_targets_per_category[category].items():
                links.append({'source': category, 'target': target, 'value': value})
        self.fig = go.Figure(data=[go.Sankey(
            node=dict(
                pad=10,
                thickness=20,
                line=dict(color='black', width=0.5),
                label=nodes,
                hovertemplate='%{source} Total Number of Tweets :%{value}',
            ),
            link=dict(
                source=[nodes.index(link['source']) for link in links],
                target=[nodes.index(link['target']) for link in links],
                value=[link['value'] for link in links],
                label=[f"{link['source']} to {link['target']}" for link in links]
            )
        )])

    def _add_hover_information(self):
        self.fig.update_layout(
            hoverlabel=dict(
                bgcolor='white',
                font_size=16,
                font_family='Rockwell'
            )
        )
        updated_node_labels = []
        for i, node in enumerate(self.fig.data[0]['node']['label']):
            if i < len(self.df_top_categories['category'].unique()):
                category = node
                num_tweets = self.df_top_categories[self.df_top_categories['category'] == category]['tweet'].count()
                hover_text = f"{category}: {num_tweets} tweets"
            else:
                target = node
                num_tweets = self.df_top_categories[self.df_top_categories['target'] == target]['tweet'].count()
                hover_text = f"{target}: {num_tweets} tweets"
            updated_node_labels.append(hover_text)
        self.fig.data[0]['node']['label'] = tuple(updated_node_labels)

    def _add_chart_title(self):
        chart_title = f"<b>Donald Trump Tweets from {self.start_date} to {self.end_date} </b>"
        self.fig.update_layout(
            title_text=chart_title,
            title_x=0.5,
            title_font=dict(size=30, color='black', family='Open Sans')
        )

    def _show_plot(self):
        self.fig.show()

    def get_chart_data(self):
        return self.fig
