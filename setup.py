from setuptools import setup, find_packages

setup(
    name="system-health-monitor",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "psutil>=5.9.0",
        "requests>=2.31.0",
        "python-dotenv>=1.0.0",
    ],
    entry_points={
        'console_scripts': [
            'system-monitor=utility.system_checker:main',
        ],
    },
    author="Md Zishan Alam",
    author_email="zishanalam752@gmail.com",
    description="A cross-platform system health monitoring utility",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/zishanalam752/Cross-Platform-System-Utility",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: System Administrators",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.7",
) 