import pandas as pd

df=pd.read_excel('Cleaned-TinderStories.xlsx')

grouped_cat=df.groupby('Category')['Title'].count()
grouped_cat=grouped_cat.to_frame()
grouped_cat=grouped_cat.reset_index()
grouped_cat=grouped_cat.rename(columns={'Title':'Count'})
grouped_cat.to_csv('Reddit_posts.csv')

# convert to datetime column
df['Publish_Date'] = pd.to_datetime(df['Publish_Date']) 

# Extract formatted string on which to groupby
df['date_year'] = df['Publish_Date'].dt.strftime('%Y')

grouped_year_cat=df.groupby(['date_year', 'Category'], as_index=False)['Title'].count()
grouped_year_cat=grouped_year_cat.rename(columns={'Title':'Count'})
grouped_year_cat=grouped_year_cat.reset_index()
grouped_year_cat.to_csv('Reddit_posts_time.csv')

