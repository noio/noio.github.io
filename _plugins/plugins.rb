
# require 'pp'

# module Jekyll

    # class Page

    #     # Full URL of the page.
    #     def full_url
    #         File.join(@dir, self.url)
    #     end

    #     alias orig_to_liquid to_liquid
    #     def to_liquid
    #         h = orig_to_liquid
    #         h['max_top'] = (self.data['max_top'] ||
    #                         site.config['max_top'] ||
    #                         15)
    #         h['date'] = self.date
    #         h
    #     end
    # end

#     class AssetsUrlTag < Liquid::Tag

#         def initialize(tag_name, path, tokens)
#             super
#             @path = path
#         end

#         def render(context)
#             if @path.nil?
#                 page_path = context.environments.first["page"]["path"]
#             else
#                 page_path = @path
#             end
#             page_base = File.basename(page_path, File.extname(page_path))
#             assets_dir = context.registers[:site].config["assets_dir"]
#             # puts page_base
#             # puts assets_dir
#             # PP.pp(context.registers[:site].config["assets_dir"])
#             "/#{assets_dir}/#{page_base}"
#         end 

#     end

#     # class PostAssets < Generator
#     #     safe true
#     #     priority :lowest

#     #     def generate(site)
#     #         site.posts.each do |post|
#     #             # Get the post filename
#     #             post_path = post.path
#     #             post_base = File.basename(post_path, File.extname(post_path))
#     #             assets_dir = site.config["assets_dir"]

#     #             puts post_base
#     #             post.assets_dir = "/#{assets_dir}/#{post_base}"
#     #         end
#     #     end
#     # end
# end

# Liquid::Template.register_tag('assets_url', Jekyll::AssetsUrlTag)

