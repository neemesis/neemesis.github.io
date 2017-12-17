---
layout: page
title: Handyman Tool
---
 Total: {{ site.categories.slave | size }}
<div class="posts">
  <hr />
  {% for post in site.posts %}
    {% if post.categories contains 'handyman' %}
       <div class="post-list">
        <h1 class="post-title-list">
          <a href="{{ post.url }}" onclick="ga('send', 'event', 'Mine', 'O: {{ post.title }}', '{{ page.url }}}', 10, { 'nonInteraction': 1 });">
            {{ post.title }}
          </a>
        </h1>
        {{ post.content }}

        <span class="post-date-list">{{ post.date | date_to_string }}</span>
      </div>
    {% endif %}
  {% endfor %}
</div>